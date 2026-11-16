# TrustPilot AI — Database Architecture & Schema Specification

TrustPilot AI is designed around a fully normalized relational schema, compatible with PostgreSQL and modern SQL engines.

---

## 1. Schema Entity-Relationship Model (ERD)

```text
┌─────────────────┐       1:N       ┌──────────────────────┐
│      users      ├─────────────────► onboarding_sessions  │
└────────┬────────┘                 └──────────────────────┘
         │
         ├──────────────────────────┐
         │ 1:1                      │ 1:1
         ▼                          ▼
┌─────────────────┐        ┌──────────────────┐
│    customers    │        │    businesses    │
└────────┬────────┘        └────────┬─────────┘
         │                          │
         │ 1:N                      ├─────────────────────┐
         ▼                          │ 1:N                 │ 1:N
┌─────────────────┐                 ▼                     ▼
│    documents    │        ┌──────────────────┐  ┌──────────────────┐
└────────┬────────┘        │    directors     │  │ business_owners  │
         │ 1:1             └──────────────────┘  └──────────────────┘
         ▼
┌───────────────────────┐
│ document_extractions  │
└───────────────────────┘
         │
         │ 1:N
         ▼
┌───────────────────────┐       1:N       ┌─────────────────────┐
│   risk_assessments    ├─────────────────►    risk_signals     │
└────────┬──────────────┘                 └─────────────────────┘
         │
         ▼ 1:1
┌───────────────────────┐       1:N       ┌─────────────────────┐
│        cases          ├─────────────────►    audit_logs       │
└───────────────────────┘                 └─────────────────────┘
```

---

## 2. Table Specifications

### 2.1 `users`
- `id` (VARCHAR(36), PK)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `role` (ENUM: 'CUSTOMER', 'BUSINESS_USER', 'ANALYST', 'PRODUCT_MANAGER', 'ADMIN')
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### 2.2 `customers`
- `id` (VARCHAR(36), PK)
- `user_id` (VARCHAR(36), FK -> users.id)
- `first_name` (VARCHAR(100), NOT NULL)
- `last_name` (VARCHAR(100), NOT NULL)
- `date_of_birth` (DATE, NOT NULL)
- `nationality` (VARCHAR(100))
- `street_address` (TEXT)
- `postal_code` (VARCHAR(20))
- `onboarding_status` (VARCHAR(50))
- `risk_score` (INTEGER, 0–100)
- `risk_level` (VARCHAR(20))

### 2.3 `businesses`
- `id` (VARCHAR(36), PK)
- `legal_name` (VARCHAR(255), NOT NULL)
- `trade_name` (VARCHAR(255))
- `registration_number` (VARCHAR(100), UNIQUE)
- `tax_id` (VARCHAR(100))
- `jurisdiction` (VARCHAR(100))
- `incorporation_date` (DATE)
- `risk_score` (INTEGER)

### 2.4 `business_owners` (UBO)
- `id` (VARCHAR(36), PK)
- `business_id` (VARCHAR(36), FK -> businesses.id)
- `full_name` (VARCHAR(255))
- `ownership_percentage` (NUMERIC(5,2))
- `is_pep` (BOOLEAN)
- `verification_status` (VARCHAR(50))

### 2.5 `cases`
- `id` (VARCHAR(36), PK)
- `case_number` (VARCHAR(50), UNIQUE)
- `entity_type` (VARCHAR(20))
- `entity_id` (VARCHAR(36))
- `risk_score` (INTEGER)
- `risk_level` (VARCHAR(20))
- `status` (ENUM: 'PENDING', 'IN_REVIEW', 'INFO_REQUESTED', 'ESCALATED', 'APPROVED', 'REJECTED')
- `recommendation_action` (TEXT)
- `recommendation_reason` (TEXT)

### 2.6 `audit_logs` (Immutable Ledger)
- `id` (VARCHAR(36), PK)
- `timestamp` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- `user_id` (VARCHAR(36), NOT NULL)
- `user_email` (VARCHAR(255), NOT NULL)
- `user_role` (VARCHAR(50), NOT NULL)
- `action` (VARCHAR(100), NOT NULL)
- `entity_type` (VARCHAR(50), NOT NULL)
- `entity_id` (VARCHAR(50), NOT NULL)
- `details` (TEXT, NOT NULL)
- `ip_address` (VARCHAR(45), NOT NULL)

