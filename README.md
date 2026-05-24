# Dinh Cong Duyen - DevOps & Full Stack Portfolio

This project is a production-ready, responsive single-page Portfolio website built using **ReactJS** and **Vite** based on Dinh Cong Duyen's CV.
It is specifically designed as a **DevOps Sandbox** containing actual multi-stage Dockerfiles, production-grade Nginx server configurations, CI/CD pipeline definitions (Jenkins, GitHub Actions, GitLab CI/CD), and Infrastructure as Code (IaC) using Terraform for AWS.

---

## 📁 Repository Structure

```
.
├── .github/workflows/ci-cd.yml  # GitHub Actions (S3 Static / ECS Container Deploy)
├── .gitlab-ci.yml               # GitLab CI/CD Pipeline definition
├── Dockerfile                   # Multi-stage production container image definition
├── docker-compose.yml           # Local multi-container development configuration
├── Jenkinsfile                  # Declarative Jenkins pipeline script
├── nginx.conf                   # Nginx security headers, compression & routing config
├── package.json                 # Project dependencies & scripts
├── src/                         # React Frontend source code
│   ├── App.jsx                  # Main components router & layout
│   ├── index.css                # Custom global design system & Print CSS (CV layout)
│   ├── components/              # Modular UI blocks (Header, About, Skills, Exp, Edu)
│   └── data/portfolioData.js    # Data file containing CV text
├── terraform/                   # Infrastructure as Code (IaC) for AWS
│   ├── main.tf                  # Provisions private S3 bucket and CloudFront OAC
│   ├── variables.tf             # Inputs & naming configurations
│   └── outputs.tf               # Regional distribution URL outputs
└── cv/                          # Ignored CV asset folder (preserved via .gitkeep)
```

---

## 🛠️ Local Development & Scaffolding

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### Get Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the hot-reloading development server:
   ```bash
   npm run dev
   ```
3. Compile the production bundle:
   ```bash
   npm run build
   ```
4. Run ESLint checks:
   ```bash
   npm run lint
   ```

---

## 🐳 Running with Docker (Local Simulation)

The build utilizes a multi-stage Docker build separating compilation (Node.js) from the serving environment (Nginx) to minimize image footprint.

### Build and Run with Docker
1. Build the image:
   ```bash
   docker build -t devops-portfolio:latest .
   ```
2. Run the container:
   ```bash
   docker run -d -p 8080:80 --name portfolio-app devops-portfolio:latest
   ```
3. Test page access at `http://localhost:8080`.

### Run using Docker Compose
For ease of management, use the compose script:
```bash
# Start container in detached mode
docker compose up -d

# Stop and clean up containers/networks
docker compose down
```

---

## ⚙️ CI/CD Pipeline Integrations

This project contains working setups for three major CI/CD engines. Use them to learn integration patterns:

### 1. Jenkins Pipeline (`Jenkinsfile`)
- Runs standard code checks (`npm run lint`).
- Compiles the React build (`npm run build`).
- Build Docker Image with specific tags.
- Logs in and pushes the container image to **Amazon ECR**.
- Performs a rolling update on **AWS ECS**.

### 2. GitHub Actions (`.github/workflows/ci-cd.yml`)
- Triggered on push/PR to `main`.
- **Option A (Static Web)**: Direct sync of `/dist` assets to **Amazon S3** and invalidates **Amazon CloudFront** edge caches.
- **Option B (Containers)**: Packages, tags, and pushes the Docker container to ECR, updating the **Amazon ECS** task definition.

### 3. GitLab CI/CD (`.gitlab-ci.yml`)
- **test**: Runs Javascript linting.
- **build**: Runs the compiler and uploads `/dist` as an artifact.
- **release**: Builds Docker image via Docker-in-Docker (`dind`) services and pushes it to the GitLab Container Registry.
- **deploy**: Leverages `aws-cli` container to trigger AWS ECS rolling updates.

---

## ☁️ Infrastructure as Code: Terraform (`terraform/`)

The Terraform files configure an optimized, highly available AWS architecture for static website hosting:

```
[User Browser] ---> (HTTPS) ---> [CloudFront CDN] ---> (Private OAC) ---> [S3 Bucket]
                                        |
                             (403/404 SPA fallback)
                                        v
                                 [index.html]
```

### Steps to Deploy AWS Infrastructure
1. Initialize provider plugins and backend:
   ```bash
   cd terraform
   terraform init
   ```
2. Check execution plan details:
   ```bash
   terraform plan
   ```
3. Provision resources:
   ```bash
   terraform apply
   ```
4. Copy the compiled `/dist` files into the S3 bucket outputted by Terraform:
   ```bash
   aws s3 sync ../dist/ s3://<s3_bucket_name> --delete
   ```
