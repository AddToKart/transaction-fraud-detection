import uuid
from datetime import datetime
from bson import json_util
import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .mongodb import MongoDB
from .gemini_service import analyze_transaction
from .serializers import TransactionSerializer, TransactionRequestSerializer
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

@api_view(['POST'])
def process_transaction(request):
    try:
        logger.info(f"Received request: {request.method} {request.path}")
        
        serializer = TransactionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(
                {"error": "Validation error", "detail": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        transaction_id = str(uuid.uuid4())
        
        # Get analysis from Gemini
        try:
            analysis_result = analyze_transaction(
                sender=serializer.validated_data['sender'],
                receiver=serializer.validated_data['receiver'],
                amount=serializer.validated_data['amount'],
                description=serializer.validated_data.get('description', '')
            )
            logger.info(f"Gemini analysis completed for transaction {transaction_id}")
        except Exception as e:
            logger.error(f"Gemini analysis error: {e}")
            return Response(
                {"error": "Analysis error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create transaction document
        transaction = {
            "id": transaction_id,
            "sender": serializer.validated_data['sender'],
            "receiver": serializer.validated_data['receiver'],
            "amount": serializer.validated_data['amount'],
            "description": serializer.validated_data.get('description', ''),
            "status": "Clear" if analysis_result["score"] < 0.5 else "Suspicious" if analysis_result["score"] < 0.8 else "Fraudulent",
            "score": analysis_result["score"],
            "explanation": analysis_result.get("explanation", ""),
            "risk_factors": analysis_result.get("risk_factors", []),
            "timestamp": datetime.now().isoformat()
        }

        # Store in MongoDB
        mongo_db = MongoDB()
        try:
            collection = mongo_db.get_collection('transactions')
            if collection is not None:
                collection.insert_one(transaction)
                logger.info(f"Transaction {transaction_id} stored in MongoDB")
            else:
                logger.error("Could not access transactions collection")
        except Exception as e:
            logger.error(f"MongoDB storage error: {e}")
            # Continue even if storage fails
        
        # Return a clean response
        response_data = {
            "id": transaction_id,
            "status": transaction["status"],
            "score": transaction["score"],
            "explanation": transaction["explanation"],
            "risk_factors": transaction["risk_factors"],
            "sender": transaction["sender"],
            "receiver": transaction["receiver"],
            "amount": transaction["amount"],
            "timestamp": transaction["timestamp"]
        }
        
        return Response(response_data)

    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return Response(
            {"error": "Server error", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_transaction_status(request, transaction_id):
    try:
        # Initialize MongoDB connection
        mongo_db = MongoDB()
        
        # Check if MongoDB is connected
        if not mongo_db.is_connected():
            logger.error("MongoDB is not connected")
            return Response(
                {"error": "Database connection not available"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Get transactions collection
        collection = mongo_db.get_collection('transactions')
        if collection is None:
            logger.error("Could not access transactions collection")
            return Response(
                {"error": "Collection not available"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Find the transaction
        try:
            # Use find_one with just the ID field
            transaction = collection.find_one({"id": transaction_id})
            
            if transaction is None:
                logger.warning(f"Transaction not found: {transaction_id}")
                return Response(
                    {"error": "Transaction not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Remove MongoDB's _id field
            if '_id' in transaction:
                transaction.pop('_id')

            logger.info(f"Successfully retrieved transaction: {transaction_id}")
            return Response(transaction)

        except Exception as e:
            logger.error(f"Error querying transaction: {e}")
            return Response(
                {"error": "Database query failed", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        logger.error(f"Error in get_transaction_status: {e}", exc_info=True)
        return Response(
            {"error": "Server error", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def health_check(request):
    try:
        # Initialize MongoDB connection
        mongo_db = MongoDB()
        
        # Test MongoDB connection and collection
        is_db_connected = mongo_db.is_connected()
        collection_available = mongo_db.has_collection('transactions')
        
        # Check Gemini configuration
        is_gemini_configured = bool(settings.GEMINI_API_KEY)

        status_response = {
            "status": "healthy" if (is_db_connected and is_gemini_configured) else "degraded",
            "mongodb": {
                "connected": is_db_connected,
                "collection_available": collection_available
            },
            "gemini": "configured" if is_gemini_configured else "not configured",
            "timestamp": datetime.now().isoformat()
        }

        return Response(status_response)

    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return Response({
            "status": "unhealthy",
            "error": str(e),
            "mongodb": "disconnected",
            "gemini": "unknown",
            "timestamp": datetime.now().isoformat()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 