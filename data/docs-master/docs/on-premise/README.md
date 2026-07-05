# On-Premise Guide

## 1. Purpose of This Document

This document describes the procedure for deploying, updating, and performing the basic configuration of the **InAppStory On-Premise** solution within the customer's infrastructure.

The document is intended for technical specialists responsible for infrastructure preparation, installation, configuration, and subsequent operation of the solution.

## 2. Scope

This document applies when the InAppStory platform is deployed within the customer's own infrastructure and operated either by the customer's internal technical teams or by authorized contractors.

## 3. Deployment Options

The InAppStory solution supports two deployment models.

### 3.1. InAppStory Cloud

When the **InAppStory Cloud** model is selected, platform deployment and configuration are performed by the InAppStory team within cloud infrastructure.

As a rule, this option is best suited for teams that require the fastest possible launch and for organizations that do not plan to allocate internal resources to maintaining their own infrastructure.

### 3.2. InAppStory On-Premise

When the **InAppStory On-Premise** model is selected, the platform is deployed within the customer's infrastructure.

As a rule, this option is best suited for enterprise customers for whom the following are critical:

- control over data;
- compliance with internal information security requirements;
- operation of the solution within their own protected environment.

## 4. Environment Requirements

### 4.1. Software Requirements

The following software environment is required for installation:

- Docker version **19.03.6** or later;
- Docker Compose version **2.32.2** or later;
- an S3-compatible file storage solution, recommended.

### 4.2. Supported Operating Systems

Correct product operation is guaranteed when installed on the following types of Linux distributions:

- Debian/Ubuntu-based;
- RHEL-based Linux, including CentOS.

### 4.3. Minimum Server Requirements

Minimum acceptable server configuration:

- CPU: **4 cores**;
- RAM: **14 GB**.

## 5. Infrastructure Configuration Recommendations

Actual load depends on audience size, usage scenarios, and traffic volume. For this reason, precise forecasting of infrastructure requirements at the planning stage may be difficult.

Below are indicative configuration recommendations for projects of different scale.

**For all deployment scenarios, the following is recommended:**

- use S3-compatible storage for file storage;
- use a CDN for media file delivery.

### 5.1. Small Projects

Indicatively: up to **100k MAU**.

As a rule, a single machine is sufficient for such projects.

Recommended minimum setup:

- CPU: **16 cores (2 GHz)**;
- RAM: **48 GB**;
- SSD: **150 GB**.

### 5.2. Medium Projects

Indicatively: up to **5m MAU**.

For such projects, it is recommended to use multiple machines, at minimum with the database placed on a separate server.

Recommended minimum setup:

**Server 1**
- CPU: **16 cores (2 GHz)**;
- RAM: **48 GB**;
- HDD: **50 GB**.

**Server 2 (DB)**
- CPU: **16 cores (2 GHz)**;
- RAM: **64 GB**;
- HDD: **200 GB**.

### 5.3. Large Projects

Indicatively: from **5m MAU**.

For such projects, the use of multiple machines is mandatory, as this is required for horizontal scaling and load balancing.

Recommended minimum setup:

**Balancer**
- CPU: **4 cores (2 GHz)**;
- RAM: **4 GB**;
- HDD: **50 GB**.

**API node**
- CPU: **8 cores (2 GHz)**;
- RAM: **8 GB**;
- HDD: **50 GB**.

**Console**
- CPU: **8 cores (2 GHz)**;
- RAM: **8 GB**;
- HDD: **50 GB**.

**DB (master + slave)**
- CPU: **16 cores (2 GHz)**;
- RAM: **64 GB**;
- HDD: **150 GB**.

**Memcached**
- CPU: **4 cores (2 GHz)**;
- RAM: **4 GB**;
- HDD: **50 GB**.

## 6. Areas of Responsibility

### 6.1. Customer Responsibilities

The customer is responsible for:

- preparing the server infrastructure;
- installing and supporting the required system components;
- configuring network access, DNS, SSL certificates, and reverse proxy;
- storing and protecting credentials;
- complying with internal requirements related to information security, backup, and monitoring.

### 6.2. InAppStory Responsibilities

The InAppStory team provides:

- the solution distribution package;
- installation and update instructions;
- advisory support within the agreed support format.

## 7. Preconditions Before Installation

Before starting the installation, ensure that:

- the server or server group has been prepared according to the selected configuration;
- Docker and Docker Compose of supported versions have been installed;
- access to the distribution repository has been provided;
- the domain to be used for service publication has been defined;
- SSL certificates have been prepared;
- the file storage solution has been defined;
- an administrative email address for initial access has been designated;
- the project name has been defined.

## 8. Installation Procedure

### 8.1. Obtain Access Credentials

Before starting the installation, obtain the username and password for repository access.

### 8.2. Clone the Project

Clone the project using the following command:

```bash
git clone https://username:password@update.inappstory.com/self-hosted.git
```

### 8.3. Navigate to the Working Directory

Move to the project directory:

```bash
cd self-hosted
```

### 8.4. Create the Authentication File

Create the `.env.auth` file in the project root directory and specify the credentials in it:

```env
IAS_UPDATE_USERNAME=username
IAS_UPDATE_PASSWORD=password
```

### 8.5. Run the Installation Script

Run the installation script:

```bash
./install.sh
```

### 8.6. Parameters Requested During Installation

During the installation process, the following input will be required:

1. Accept or decline the transmission of debug data.  
   This data is used exclusively to improve the product.

2. Enter the administrator email address and password.  
   The password must:
    - contain at least 8 characters;
    - include letters and numbers.

3. Enter the project name.

### 8.7. Start the Services

After the installation is complete, start the containers:

```bash
docker compose up -d
```

### 8.8. Configure Nginx

After the containers are started, Nginx must be configured.

Example configuration:

```nginx
upstream self-hosted {
    server 127.0.0.1:9000;
}

server {
    server_name example.com;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location / {
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Host $http_host;
        proxy_set_header X-Request-Id $request_id;
        proxy_buffering off;
        proxy_cache off;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_pass http://self-hosted;
    }
}

server {
    if ($host = example.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name example.com;
    return 404; # managed by Certbot
}
```

## 9. Post-Installation Verification

After installation is complete, it is recommended to perform a basic operational check:

- ensure that the containers are running without errors;
- verify service availability via the target domain name;
- verify the correctness of the SSL certificate;
- ensure that the administrative interface opens correctly;
- verify administrator authentication;
- ensure correct operation of Nginx as a reverse proxy;
- if external S3 storage is used, verify read and write operations for file storage.

## 10. Update Procedure

To update the solution, perform the following steps.

### 10.1. Navigate to the Project Directory

```bash
cd self-hosted
```

### 10.2. Pull the Latest Changes

```bash
git pull origin master
```

### 10.3. Run the Installation Script Again

```bash
./install.sh
```

### 10.4. Restart the Containers

```bash
docker compose down
docker compose up -d
```

## 11. Configuration

### 11.1. Mail Delivery Configuration

To configure mail delivery:

1. Navigate to the project directory:

```bash
cd self-hosted
```

2. Edit the `.env` file.

Specify the following parameters:

```env
MAILER_DSN=
MAILER_SENDER=
```

Where:
- `MAILER_DSN` is the mail service address;
- `MAILER_SENDER` is the sender name.

3. Restart the containers:

```bash
docker compose down
docker compose up -d
```

### 11.2. Using Your Own S3 Storage

To use your own S3-compatible storage:

1. Navigate to the project directory:

```bash
cd self-hosted
```

2. Edit the `.env` file.

Specify the following parameters:

```env
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET=
S3_REGION=
S3_HOST=
```

Where:
- `S3_ACCESS_KEY_ID` is the access key for S3;
- `S3_SECRET_ACCESS_KEY` is the secret access key for S3;
- `S3_BUCKET` is the S3 bucket name;
- `S3_REGION` is the S3 region;
- `S3_HOST` is the S3 host;

3. Remove the `seaweedfs` image reference from the `docker-compose.yml` file.

4. Restart the containers:

```bash
docker compose down
docker compose up -d
```

## 12. Security Notes

When operating the solution within the customer's environment, it is recommended to:

- restrict access to administrative interfaces at the network level;
- use secure storage for credentials and secrets;
- avoid storing usernames and passwords in plain text outside protected configuration files;
- restrict access to the repository and server infrastructure according to the principle of least privilege;
- ensure the use of valid SSL certificates;
- implement internal logging, monitoring, and change control procedures in accordance with the customer's policies.

## 13. Backup and Recovery

This document does not establish a detailed backup policy. However, for production operation it is recommended to provide:

- database backup;
- backup of project configuration files;
- backup of file storage data;
- a tested recovery procedure.

Before performing an update, it is recommended to back up at minimum:

- the database;
- the `.env` file;
- the `.env.auth` file;
- modified infrastructure configuration files, including Nginx settings and `docker-compose.yml`.

## 14. Rollback Procedure

In the event of an unsuccessful update, it is recommended to have an internal rollback procedure that includes:

- restoring the previous code version;
- restoring the database backup;
- restoring previous configuration files;
- restarting services after recovery.

The specific rollback scenario is determined by the customer's infrastructure policy.

## 15. Limitations and Notes

- The infrastructure configurations provided are indicative.
- Actual requirements may vary depending on load, number of users, media volume, and operating conditions.
- The use of S3-compatible storage and CDN is recommended in all scenarios involving production operation.
- Monitoring, alerting, logging, backup, and disaster recovery must be organized by the customer in accordance with internal standards.

## 16. Support Escalation Procedure

If incidents or questions arise during installation, updates, or operation, it is recommended to define in advance:

- the support communication channel;
- responsible contacts on the customer side;
- responsible contacts on the InAppStory side;
- the list of technical information required for diagnostics.

As a rule, incident investigation may require:

- a description of the issue;
- the time of occurrence;
- container and service logs;
- information about changes made before the issue occurred;
- information about the current environment configuration.
