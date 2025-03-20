from pymongo import MongoClient, errors
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        try:
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[settings.MONGODB_DB]
            # Test connection
            self.client.admin.command('ping')
            logger.info("MongoDB connection established")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            if self.client:
                self.client.close()
            self.client = None
            self.db = None

    def get_collection(self, collection_name):
        """Get a MongoDB collection."""
        try:
            if not self.is_connected():
                logger.error("Cannot get collection - MongoDB not connected")
                return None
            
            collection = self.db[collection_name]
            # Verify collection exists
            if collection_name not in self.db.list_collection_names():
                logger.error(f"Collection {collection_name} does not exist")
                # Create the collection
                self.db.create_collection(collection_name)
                logger.info(f"Created collection: {collection_name}")
            return collection
        except Exception as e:
            logger.error(f"Error accessing collection {collection_name}: {e}")
            return None

    def is_connected(self):
        """Check if MongoDB is connected."""
        try:
            if self.client is None or self.db is None:
                return False
            # Test connection with ping
            self.client.admin.command('ping')
            return True
        except Exception:
            return False

    def has_collection(self, collection_name):
        """Check if collection exists and is accessible."""
        try:
            if not self.is_connected():
                return False
            return collection_name in self.db.list_collection_names()
        except Exception:
            return False

    def __del__(self):
        if self.client:
            try:
                self.client.close()
            except Exception as e:
                logger.error(f"Error closing MongoDB connection: {e}") 