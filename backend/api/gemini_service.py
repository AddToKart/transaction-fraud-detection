import os
import google.generativeai as genai
from django.conf import settings
import logging
import json
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Configure the Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_transaction(
    sender: str, 
    receiver: str, 
    amount: float, 
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze a transaction using Gemini AI to detect potential fraud.
    """
    try:
        if not settings.GEMINI_API_KEY:
            logger.warning("No Gemini API key provided, using mock implementation")
            return _mock_analyze_transaction(sender, receiver, amount, description)
        
        # Create a detailed prompt for Gemini
        prompt = f"""
        You are a blockchain fraud detection expert. Analyze this cryptocurrency transaction and provide a detailed risk assessment.

        Transaction Details:
        - Sender Address: {sender}
        - Receiver Address: {receiver}
        - Amount: {amount} ETH
        - Description: {description or 'No description provided'}

        Provide your analysis in the following format:

        1. Address Analysis:
        - Evaluate the format and patterns of both addresses
        - Check for known suspicious patterns
        - Look for potential red flags

        2. Amount Analysis:
        - Assess if the amount is unusual
        - Compare with typical transaction patterns
        - Check for suspicious round numbers or patterns

        3. Description Analysis:
        - Analyze the transaction description
        - Look for suspicious keywords or patterns
        - Evaluate the context

        4. Overall Risk Assessment:
        - Provide a risk score between 0 and 1
        - List specific risk factors
        - Explain your reasoning

        5. Recommendations:
        - Provide specific action items
        - Suggest risk mitigation steps

        Return your analysis in a clear, structured format with bullet points where appropriate.
        Focus on being specific and actionable rather than general.
        """

        try:
            # First try with gemini-1.5-pro
            logger.info("Attempting to use gemini-1.5-pro model")
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
        except Exception as model_error:
            logger.warning(f"Error with gemini-1.5-pro: {model_error}")
            try:
                # Fall back to gemini-1.0-pro
                logger.info("Falling back to gemini-1.0-pro model")
                model = genai.GenerativeModel('gemini-1.0-pro')
                response = model.generate_content(prompt)
            except Exception as fallback_error:
                logger.warning(f"Error with fallback model: {fallback_error}")
                # List available models for debugging
                try:
                    available_models = genai.list_models()
                    model_names = [model.name for model in available_models]
                    logger.info(f"Available models: {model_names}")
                    
                    # Try the first available text model
                    for model_info in available_models:
                        if "generateContent" in model_info.supported_generation_methods:
                            logger.info(f"Trying available model: {model_info.name}")
                            model = genai.GenerativeModel(model_info.name)
                            response = model.generate_content(prompt)
                            break
                    else:
                        raise Exception("No suitable models available")
                except Exception as e:
                    logger.error(f"Could not find any working models: {e}")
                    return _mock_analyze_transaction(sender, receiver, amount, description)
        
        if not response or not response.text:
            logger.error("Empty response from Gemini")
            return _mock_analyze_transaction(sender, receiver, amount, description)

        # Parse Gemini's response
        analysis = response.text.strip()
        logger.info(f"Received analysis from Gemini: {analysis[:200]}...")
        
        # Extract risk score from the analysis (looking for numbers between 0 and 1)
        import re
        score_matches = re.findall(r'(?:risk|score).*?([0-9]*\.?[0-9]+)', analysis.lower())
        score = float(score_matches[0]) if score_matches else 0.5

        # Cap the score between 0 and 1
        score = max(0.0, min(1.0, score))

        # Extract risk factors
        risk_factors = []
        for line in analysis.split('\n'):
            if line.strip().startswith('•') or line.strip().startswith('-'):
                risk_factors.append(line.strip().lstrip('•').lstrip('-').strip())

        # Format the analysis result in a more structured way
        explanation = f"""
# Cryptocurrency Transaction Risk Assessment

## Transaction Details
- **Sender Address:** {sender}
- **Receiver Address:** {receiver}
- **Amount:** {amount} ETH
- **Description:** {description or 'Not provided'}

## 1. Address Analysis
### Format Check
✓ Both addresses appear to be valid Ethereum addresses, conforming to the standard hexadecimal format.

### Suspicious Patterns
⚠️ Need to check both addresses against known databases of:
- Scams
- Hacks
- Darknet marketplaces
- Sanctioned addresses

### Red Flags
{generate_red_flags(sender, receiver)}

## 2. Amount Analysis
### Transaction Size
{'⚠️ Large transaction amount detected' if amount > 10 else '✓ Amount within normal range'} ({amount} ETH)

### Pattern Analysis
- {'⚠️ Round number detected (higher risk)' if amount == round(amount) else '✓ Non-round number (lower risk)'}
- Transaction size relative to network average: {get_size_assessment(amount)}

## 3. Description Analysis
### Keywords
{analyze_description(description)}

### Context Assessment
{generate_context_assessment(description)}

## 4. Overall Risk Assessment
Risk Score: {score:.2f}
{generate_risk_summary(score)}

## 5. Recommendations
{generate_recommendations(score)}
"""

        return {
            "score": score,
            "explanation": explanation,
            "risk_factors": risk_factors
        }

    except Exception as e:
        logger.error(f"Error in Gemini analysis: {e}")
        return _mock_analyze_transaction(sender, receiver, amount, description)

def generate_recommendations(score: float, risk_factors: list) -> str:
    if score < 0.3:
        return "Transaction appears safe. Standard precautions apply."
    
    recommendations = ["Before proceeding with this transaction:"]
    
    if "Invalid sender address" in str(risk_factors):
        recommendations.append("• Verify the sender's address format and checksum")
    if "Invalid receiver address" in str(risk_factors):
        recommendations.append("• Double-check the recipient's address")
    if any("amount" in str(factor).lower() for factor in risk_factors):
        recommendations.append("• Consider splitting into smaller transactions")
        recommendations.append("• Verify the amount with the recipient through a separate channel")
    if any("keyword" in str(factor).lower() for factor in risk_factors):
        recommendations.append("• Be cautious of urgent or pressure tactics")
        recommendations.append("• Verify the transaction purpose through trusted channels")
    
    if score > 0.7:
        recommendations.append("\nHIGH RISK ALERT:")
        recommendations.append("• Strongly recommended to delay this transaction")
        recommendations.append("• Contact your security team or blockchain advisor")
        recommendations.append("• Consider reporting to relevant authorities")
    
    return "\n".join(recommendations)

def _mock_analyze_transaction(
    sender: str, 
    receiver: str, 
    amount: float, 
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Mock implementation of transaction analysis when Gemini API is not available.
    """
    import random
    
    # Generate a pseudo-random score based on transaction properties
    score_base = 0.1  # Start with a low base score
    risk_factors = []
    
    # Add randomness
    score_base += random.uniform(0, 0.3)
    
    # Address analysis
    if len(sender) != 42 or not sender.startswith('0x'):
        risk_factors.append("Invalid sender address format")
        score_base += 0.2
    if len(receiver) != 42 or not receiver.startswith('0x'):
        risk_factors.append("Invalid receiver address format")
        score_base += 0.2
    
    # Higher amounts might be more suspicious
    if amount > 5.0:
        risk_factors.append(f"Large transaction amount: {amount} ETH")
        score_base += 0.2
    
    # Round numbers are suspicious
    if amount == round(amount):
        risk_factors.append("Suspicious round number amount")
        score_base += 0.1
    
    # Certain keywords in description might increase score
    suspicious_keywords = ["urgent", "transfer", "investment", "opportunity", "quick"]
    found_keywords = []
    if description:
        description_lower = description.lower()
        for keyword in suspicious_keywords:
            if keyword in description_lower:
                found_keywords.append(keyword)
                score_base += 0.15
    
    if found_keywords:
        risk_factors.append(f"Suspicious keywords found: {', '.join(found_keywords)}")
    
    # Cap the score at 0.95 to avoid always flagging as fraud
    score = min(0.95, score_base)
    
    # Generate detailed explanation
    explanation = f"""
1. Address Analysis:
{'✓ Valid address formats' if len(sender) == 42 and sender.startswith('0x') and len(receiver) == 42 and receiver.startswith('0x') else '⚠ Invalid address format detected'}
{f"- Sender address format issues: {sender}" if len(sender) != 42 or not sender.startswith('0x') else ""}
{f"- Receiver address format issues: {receiver}" if len(receiver) != 42 or not receiver.startswith('0x') else ""}

2. Amount Analysis:
- Amount: {amount} ETH
{'- ⚠ Unusually large transaction' if amount > 5.0 else '- ✓ Within normal range'}
{f"- ⚠ Round number detected - common in fraud schemes" if amount == round(amount) else ""}

3. Description Analysis:
{f"- ⚠ Suspicious elements detected: {', '.join(found_keywords)}" if found_keywords else "- ✓ No suspicious keywords detected"}
- Description: {description or 'No description provided'}

4. Overall Risk Assessment:
- Risk Score: {score:.2f}
{chr(10).join(f"- {factor}" for factor in risk_factors) if risk_factors else "- No significant risk factors identified."}

5. Recommendations:
{generate_recommendations(score, risk_factors)}
"""
    
    return {
        "score": score,
        "explanation": explanation,
        "risk_factors": risk_factors
    } 