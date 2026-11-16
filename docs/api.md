# TrustPilot AI — REST API Reference

All requests and responses use standard JSON with consistent schemas:
```json
{
  "success": true,
  "data": { ... }
}
```
Errors return structured codes and human-readable messages:
```json
{
  "success": false,
  "error": {
    "code": "DOCUMENT_VERIFICATION_FAILED",
    "message": "The document could not be verified."
  }
}
```

---

## 1. System Health
### `GET /api/health`
Returns system health, uptime, and modular provider statuses.
**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-11-16T15:20:00Z",
  "version": "1.0.0",
  "checks": {
    "database": "UP",
    "riskEngine": "UP",
    "ocrPipeline": "UP",
    "biometricsProvider": "UP",
    "amlScreening": "UP"
  },
  "uptime": 1284.5
}
```

---

## 2. Customer Onboarding (KYC)
### `POST /api/onboarding`
Creates or updates customer identity details.
**Request Body:**
```json
{
  "firstName": "Sarah",
  "lastName": "Jenkins",
  "email": "sarah.jenkins@example.com",
  "phone": "+1 555-234-8901",
  "dateOfBirth": "1993-04-19",
  "nationality": "United States",
  "address": {
    "street": "450 Sutter St",
    "city": "San Francisco",
    "postalCode": "94108",
    "country": "United States"
  }
}
```

---

## 3. Modular Document OCR
### `POST /api/documents/verify`
Analyzes document image or PDF for optical quality and parses fields.
**Request Body:**
```json
{
  "customerId": "cust_101",
  "fileName": "us_passport.jpg",
  "fileSize": 1843200,
  "mimeType": "image/jpeg",
  "documentType": "PASSPORT"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "document": {
    "id": "doc_8492",
    "status": "VERIFIED",
    "extraction": {
      "qualityScore": 95,
      "fields": {
        "fullName": { "value": "Sarah Jenkins", "confidence": 98 },
        "dateOfBirth": { "value": "1993-04-19", "confidence": 97 },
        "documentNumber": { "value": "P9823410", "confidence": 99 }
      }
    }
  }
}
```

---

## 4. Biometric 3D Liveness
### `POST /api/liveness/verify`
Simulates active challenge-response biometric anti-spoofing analysis.
**Request Body:**
```json
{
  "customerId": "cust_101",
  "challenges": ["center_face", "blink_detected", "head_turn_right"]
}
```

---

## 5. Risk Assessment & TrustPath AI
### `POST /api/risk/assess`
Calculates 0–100 risk score, identifies positive/risk signals, screens AML, and generates TrustPath next-best-action.
**Request Body:**
```json
{
  "customerId": "cust_102",
  "name": "Rahul Kumar",
  "country": "United Kingdom",
  "deviceRiskScore": 15,
  "ipRiskScore": 20
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "riskResult": {
    "score": 64,
    "level": "HIGH",
    "positiveSignals": [ ... ],
    "riskSignals": [ ... ]
  },
  "recommendation": {
    "recommendedAction": "Request Additional Proof of Address",
    "reason": "Identity and liveness confidence are strong (>=94%), but residential address confidence is low.",
    "expectedOutcome": "Reduce unnecessary manual analyst review by 72%.",
    "automationConfidence": 91
  }
}
```

---

## 6. Cases & Decisions
### `GET /api/cases`
Query compliance triage queue with search, status, and risk filters.

### `POST /api/cases/:id`
Commit an analyst decision with mandatory compliance justification.
**Request Body:**
```json
{
  "action": "APPROVED",
  "reason": "Identity reconciled via secondary utility bill verification.",
  "overrideAi": false,
  "performedBy": "elena.rostova@trustpilot-ai.internal"
}
```
