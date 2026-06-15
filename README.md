# Homework Question & Answer Assistant

**Course Code:** COMP6703001  
**Course Name:** Web Application Development and Security  
**Institution:** BINUS University International  

---

## 1. Project Information

**Project Title:** Homework Question & Answer Assistant  
**Project Domain:** Homework Question & Answer Assistant  
**Class:** L4BC 

### Group Members (Max 3 — same class only)

| Name | Student ID | Role | GitHub Username |
|------|------------|------|-----------------|
|Allenxavinzky Adjiewibowo|2802467880|Frontend, AI Implementation|Simayawan|
|Nicholas Nixon Iswanto|2802546664|Testing, Backend|NicholasNixon10|
---

## 2. Instructor & Repository Access

This repository must be shared with:

- **Instructor:** Ida Bagus Kerthyayana Manuaba
  - Email: imanuaba@binus.edu
  - GitHub: bagzcode
- **Instructor Assistant:** Juwono
  - Email: juwono@binus.edu
  - GitHub: Juwono136

---

## 3. Project Overview

### 3.1 Problem Statement

[Explain:]
- What problem does this application solve?
- Who are the target users?

This Web App aims to help students with their homework  
by giving them valuable explainations using AI, as well  
as allowing them to take a picture of their homework  
and letting the AI analyze it and explain it to them in  
detail.  
  
  The target users of this Web App are students, namely  
  high school students and university students.

### 3.2 Solution Overview

[Briefly describe:]
- Main features
- Why this solution is appropriate
- Where AI is used  

There are two main features of this Web App:  
- OCR
- NLP

NLP is used for the main feature which is the chatbot feature.  
You can ask the chatbot anything related to your homework and it  
will give you the answer and a detailed solution to go along with it.  

OCR is used for the second AI feature which allows the user to upload images  
of their homework so that users would not have to type it themselves on the  
chat.  

These solutions are appropriate for the problems faced by students because:
1. NLP solves the need for users wanting answers and needing to ask someone or something, while;

2. OCR solves the need for users to input hard to write questions, like in mathematics, where there are sometimes very big and long equations where it would waste too much time just to write it completely in a textbox.

---

## 4. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) |
| Backend | Node.js / Next.js API Routes |
| API | REST API |
| Database | PostgreSQL (NeonDB) via Prisma ORM |
| Containerization | Docker + Docker Compose |
| Deployment | University VPS (csbihub.id) via Cloudflare |
| Version Control | GitHub |

---

## 5. System Architecture

### 5.1 Architecture Diagram

[Insert architecture diagram here]

### 5.2 Architecture Explanation

[Explain:]
- Frontend ↔ API ↔ Database interaction
- Separation of concerns
- Where security is enforced

---

## 6. API Design

### 6.1 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/login | User login | No |
| POST | /api/auth/signup | User registration | No |
| GET | /api/chat/history | Get chat history | Yes |
| POST | /api/chat | Send chat message | Yes |
| POST | /api/chat/ocr | OCR image processing | Yes |
| GET | /api/features | Get all features | Yes |
| GET | /api/features/[id] | Get feature by ID | Yes |
| GET | /api/docs | API documentation | No |

### 6.2 API Documentation

- Swagger docs available at: `https://e2526-wads-b4bc-02.csbihub.id/api-docs`
- [Postman collection link if available]

**Example Request & Response:**

```json
// POST /api/auth/login
// Request
{
  "email": "student@haq.edu",
  "password": "securePassword123"
}

// Response
curl -X 'POST' \
  'http://localhost:3000/api/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "student@haq.edu",
  "password": "securePassword123"
}'

//Requested URL
http://localhost:3000/api/login
```

---

## 7. Database Design

### 7.1 Database Choice

PostgreSQL hosted on NeonDB (serverless) was chosen for:
- Serverless scalability
- Built-in connection pooling
- Prisma ORM compatibility
- Free tier availability for university projects

### 7.2 Schema / Data Structure

[Insert ERD diagram here]

```prisma
model User {
  id        Int           @id @default(autoincrement())
  email     String        @unique
  name      String?
  password  String
  chats     ChatSession[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model ChatSession {
  id        String    @id @default(uuid())
  title     String    @default("New Question")
  createdAt DateTime  @default(now())
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
}

model Message {
  id            String      @id @default(uuid())
  role          String
  content       String      @db.Text
  imageUrl      String?
  createdAt     DateTime    @default(now())
  chatSessionId String
  chatSession   ChatSession @relation(fields: [chatSessionId], references: [id])
}
```

---

## 8. AI Features

### 8.1 AI Feature List

| AI Feature | Purpose | AI Type |
|------------|---------|---------|
| NLP-based Q&A Chatbot | Analyzes the question and gives user detailed explainations | NLP |
| OCR Image Processing | Extract text from uploaded homework images for analysis | OCR |

### 8.2 AI Integration Flow

**Chatbot:**
Input (text question) → OpenRouter API (LLM) → Step-by-step explanation → Displayed to user

**OCR:**
Input (image upload) → OCR API → Extracted text → Passed to LLM → Answer displayed to user

---

## 9. Security Implementation

| Security Concern | Implementation |
|-----------------|----------------|
| Authentication | HTTP-only session cookie set on login. Client-side route protection via localStorage userId check (redirects unauthenticated users to login page).|
| Authorization | Client-side only, protected pages verify userId in localStorage before rendering. Server-side middleware not yet implemented |
| Input Validation | Required field validation on all auth endpoints. Will returns 400 if email or password missing. Duplicate email returns 409. No email format or password strength validation |
| SQL Injection | NeonDB tagged template literals auto-parameterize all queries, preventing SQL injection |
| XSS | User content rendered via ReactMarkdown which safely escapes HTML. No raw HTML injection. No explicit DOMPurify sanitization |
| CSRF |  HTTP-only cookie with secure: true in production. Next.js default SameSite=Lax provides basic CSRF protection. No explicit CSRF token implementation |
| Secure API Keys | All keys are stored in the environment variables, they are never exposed to the client. They are stored specifically in .env.production |
| Password Storage | Passwords are currently stored in plain text. bcrypt hashing is planned as a future improvement. |
| Prompt Injection | System prompt constraints define AI behavior boundaries |

---

## 10. Testing Documentation

### 10.1 Frontend Testing

| Test Case | Scenario | Expected Result | Status |
|-----------|----------|-----------------|--------|
| FE-01 | Login with valid credentials | Redirect to dashboard | Pass/Fail |
| FE-02 | Login with invalid credentials | Show error message | Pass/Fail |
| FE-03 | Submit empty login form | Show validation errors | Pass/Fail |
| FE-04 | Sign up with existing email | Show duplicate error | Pass/Fail |
| FE-05 | Sign up with mismatched passwords | Show validation error | Pass/Fail |
| FE-06 | Submit question in chat | Display AI response | Pass/Fail |
| FE-07 | Upload image for OCR | Display extracted text and answer | Pass/Fail |
| FE-08 | Access protected page without login | Redirect to login | Pass/Fail |

### 10.2 Backend & API Testing

| Test Case | Endpoint | Input | Expected Output | Status |
|-----------|----------|-------|-----------------|--------|
| API-01 | POST /api/auth/login | Valid credentials | 200 + JWT token | Pass/Fail |
| API-02 | POST /api/auth/login | Invalid password | 401 Unauthorized | Pass/Fail |
| API-03 | POST /api/auth/signup | Valid new user | 201 Created | Pass/Fail |
| API-04 | POST /api/auth/signup | Duplicate email | 400 Bad Request | Pass/Fail |
| API-05 | GET /api/chat/history | Valid JWT | 200 + history array | Pass/Fail |
| API-06 | GET /api/chat/history | No JWT | 401 Unauthorized | Pass/Fail |
| API-07 | POST /api/chat | Valid question | 200 + AI response | Pass/Fail |
| API-08 | POST /api/chat/ocr | Valid image | 200 + extracted text | Pass/Fail |
| API-09 | POST /api/chat/ocr | Invalid file type | 400 Bad Request | Pass/Fail |

### 10.3 Security Testing

| Test Case | Attack Type | Expected Behavior | Result |
|-----------|-------------|-------------------|--------|
| SEC-01 | XSS — script tag in chat input | Input sanitized, script not executed | Pass/Fail |
| SEC-02 | SQL Injection in login | Query blocked by Prisma ORM | Pass/Fail |
| SEC-03 | Access protected route without token | 401 Unauthorized returned | Pass/Fail |
| SEC-04 | Prompt injection in chat | AI response stays within bounds | Pass/Fail |
| SEC-05 | Brute force login | Rate limiting triggers | Pass/Fail |
| SEC-06 | Upload malicious file via OCR | File type validation rejects it | Pass/Fail |

### 10.4 AI Functionality Testing

#### AI Feature: NLP-based Q&A Chatbot

| Test Case | Input | Expected Output | Actual Result | Status |
|-----------|-------|-----------------|---------------|--------|
| AI-01 | Valid math question | Step-by-step solution | [Fill in] | Pass/Fail |
| AI-02 | Valid science question | Accurate explanation | [Fill in] | Pass/Fail |
| AI-03 | Empty input | Validation error | [Fill in] | Pass/Fail |
| AI-04 | Nonsensical input ("asdfjkl;") | Graceful fallback response | [Fill in] | Pass/Fail |
| AI-05 | Prompt injection attempt | Safe response, no system bypass | [Fill in] | Pass/Fail |
| AI-06 | Offensive/inappropriate content | Refused or filtered | [Fill in] | Pass/Fail |
| AI-07 | Question in different language | Response in same language | [Fill in] | Pass/Fail |
| AI-08 | Extremely long input | Handled without crash | [Fill in] | Pass/Fail |
| AI-09 | Repeated same question | Consistent answer | [Fill in] | Pass/Fail |

**Failure Handling:**
- If AI is unavailable: [Describe fallback behavior]
- If response times out: [Describe timeout handling]
- If malformed response: [Describe error handling]

#### AI Feature: OCR Image Processing

| Test Case | Input | Expected Output | Actual Result | Status |
|-----------|-------|-----------------|---------------|--------|
| AI-10 | Clear printed text image | Accurate text extraction | [Fill in] | Pass/Fail |
| AI-11 | Handwritten text image | Best-effort extraction | [Fill in] | Pass/Fail |
| AI-12 | Blank/empty image | Error or empty response | [Fill in] | Pass/Fail |
| AI-13 | Non-homework image (e.g. face) | Handled gracefully | [Fill in] | Pass/Fail |
| AI-14 | Very large image file | Handled without crash | [Fill in] | Pass/Fail |
| AI-15 | Corrupted image file | Validation error returned | [Fill in] | Pass/Fail |

**Failure Handling:**
- If OCR API is unavailable: [Describe fallback behavior]
- If image cannot be processed: [Describe error handling]

---

## 11. Deployment & Production Setup

### 11.1 Docker Setup

- ✅ Dockerfile included
- ✅ docker-compose.yml included

### 11.2 Production Environment

- **Environment Variables:** All secrets stored in `.env.production` (not committed to git)
- **Secrets Handling:** Sensitive keys managed via GitHub Actions Secrets
- **HTTPS:** Enabled via Cloudflare proxy
- **CI/CD:** GitHub Actions with self-hosted runner on university VPS

### 11.3 Live Application URL

```
https://e2526-wads-b4bc-02.csbihub.id
```

---

## 12. GitHub Contribution Summary

Note: Allen did a mistake that caused the Github contribution to be nuked (which can be seen with how everything seemed to be pushed on the same day), so some of these contributions would likely not align with what is seen on the github.

### Allenxavinzky Adjiewibowo
- Features implemented: All AI, including NLP-based Chatbot and OCR, Chat History
- API endpoints handled: /api/chat, /api/chat/ocr, /api/chat/history
- Tests written: N/A
- Security work: 
- AI-related work: OpenRouter API integration (DeepSeek model), OCR API integration, system prompt design, multi-turn conversation history

### Nicholas Nixon
- Features implemented: Login and Sign in authentication
- API endpoints handled: /api/auth/login, /api/auth/signup
- Tests written:
- Security work:
- AI-related work:

---

## 13. AI Usage Disclosure

| AI Tool | Purpose | Parts Assisted |
|---------|---------|----------------|
| Gemini | Error Troubleshooting, Code Analysis, Testing | We used AI to analyze code and troubleshoot errors along the way, it helped us by showing us what went wrong when the code does not work. We also used AI to create testing scenarios for us to use for both our NLP and OCR AI |
| OpenRouter API | Core AI feature for Q&A chatbot | Integrated as application feature |
| OCR API | Core AI feature for image text extraction | Integrated as application feature |

*All AI-generated code was reviewed, modified, and understood by the team.*

---

## 14. Known Limitations & Future Improvements

### Current Limitations
- [List any known bugs or limitations]
- AI responses may vary...
- OCR accuracy depends on image quality and colors of the background
- - Passwords are stored in plain text as bcrypt hashing not yet implemented

### Future Improvements
- [List planned enhancements]
- Support for more file formats in OCR
- Multi-language support
- Implement bycrpt hashing for more security

### AI Limitations & Risks
- LLM may occasionally produce incorrect answers (hallucination)
- OCR accuracy decreases with poor image quality
- OCR only accepts PNG and JPEG
- Prompt injection risks mitigated but not fully eliminated
- No rate limiting on API endpoints — susceptible to abuse/spam

---

## 15. Final Declaration

We declare that:
- This project is our own work
- AI usage is disclosed honestly
- All group members understand the system

**Signed by Group Members:**
- Allenxavinzky Adjiewibowo
- Nicholas Nixon Iswanto

---

## 16. Setup

### Prerequisites
- Node.js v20+
- Docker & Docker Compose
- NeonDB account

### Local Development

```bash
# Clone the repository
git clone https://github.com/Simayawan/WADS-Project.git
cd WADS-Project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

### Running Tests

```bash
npm test
```

---

## 17. Deployment Instructions

### Prerequisites
- Docker & Docker Compose installed on VPS
- GitHub Actions self-hosted runner configured on VPS

### Deploy via CI/CD (Automatic)

Push to `main` branch — GitHub Actions will automatically build and deploy.

### Manual Deployment

```bash
# SSH into VPS via Cloudflare Access
# https://csbiweb-ssh.csbihub.id/

# Clone repository
git clone https://github.com/Simayawan/WADS-Project.git
cd WADS-Project

# Create environment file
nano .env.production
# Fill in your production values

# Build and run
docker compose up -d --build

# Check status
docker ps
docker logs haq-app
```

