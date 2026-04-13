-- Create and use the CWSMS database
CREATE DATABASE IF NOT EXISTS CWSMS;
USE CWSMS;

-- PACKAGE TABLE
CREATE TABLE IF NOT EXISTS Package (
    PackageNumber INT AUTO_INCREMENT PRIMARY KEY,
    PackageName VARCHAR(100) NOT NULL,
    PackageDescription VARCHAR(255),
    PackagePrice DECIMAL(10, 2) NOT NULL
);

-- CAR TABLE
CREATE TABLE IF NOT EXISTS Car (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    CarType VARCHAR(100) NOT NULL,
    CarSize VARCHAR(50) NOT NULL,
    DriverName VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL
);

-- SERVICE PACKAGE TABLE
CREATE TABLE IF NOT EXISTS ServicePackage (
    RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
    PlateNumber VARCHAR(20) NOT NULL,
    PackageNumber INT NOT NULL,
    ServiceDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_car FOREIGN KEY (PlateNumber)
        REFERENCES Car(PlateNumber)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_service_package FOREIGN KEY (PackageNumber)
        REFERENCES Package(PackageNumber)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- PAYMENT TABLE
CREATE TABLE IF NOT EXISTS Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    RecordNumber INT NOT NULL,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_service FOREIGN KEY (RecordNumber)
        REFERENCES ServicePackage(RecordNumber)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- USER TABLE (for session-based authentication)
CREATE TABLE IF NOT EXISTS User (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(30) NOT NULL DEFAULT 'staff',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed default packages (idempotent using insert check)
INSERT INTO Package (PackageName, PackageDescription, PackagePrice)
SELECT 'Basic Wash', 'Exterior wash with quick dry', 5000
WHERE NOT EXISTS (SELECT 1 FROM Package WHERE PackageName = 'Basic Wash');

INSERT INTO Package (PackageName, PackageDescription, PackagePrice)
SELECT 'Classic Wash', 'Exterior + interior cleaning', 10000
WHERE NOT EXISTS (SELECT 1 FROM Package WHERE PackageName = 'Classic Wash');

INSERT INTO Package (PackageName, PackageDescription, PackagePrice)
SELECT 'Premium Wash', 'Full detail with polish and tire shine', 20000
WHERE NOT EXISTS (SELECT 1 FROM Package WHERE PackageName = 'Premium Wash');

-- Seed default admin user (password: admin123)
INSERT INTO User (FullName, Email, PasswordHash, Role)
SELECT 'System Admin', 'admin@smartpark.local', '$2b$10$UU7V7gtSRaWw7Llq3uXEluslgiuvIqtm0aZpUJ8H6qtCM9TIwH7w6', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM User WHERE Email = 'admin@smartpark.local');
