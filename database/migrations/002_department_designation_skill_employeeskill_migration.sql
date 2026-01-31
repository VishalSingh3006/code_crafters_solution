-- =====================================================
-- Resource & Engagement Tracking System
-- Department, Designation, Skill & EmployeeSkill Migration
-- Generated on: January 31, 2026
-- =====================================================

USE `resourceengagementtrackingsystem`;

-- =====================================================
-- 1. CREATE DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `Departments` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `ManagerId` INT NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Departments_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. CREATE DESIGNATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `Designations` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `Level` VARCHAR(50) NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Designations_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. CREATE SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `Skills` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Category` VARCHAR(50) NULL,
    `Description` TEXT NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Skills_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. UPDATE EMPLOYEES TABLE - ADD NEW COLUMNS
-- =====================================================

-- Add EmployeeCode column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'EmployeeCode'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `EmployeeCode` VARCHAR(50) NOT NULL DEFAULT "EMP001" AFTER `Id`',
    'SELECT "EmployeeCode column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add Phone column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'Phone'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `Phone` VARCHAR(20) NULL AFTER `Email`',
    'SELECT "Phone column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add DateOfJoining column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DateOfJoining'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DateOfJoining` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) AFTER `Phone`',
    'SELECT "DateOfJoining column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add DateOfBirth column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DateOfBirth'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DateOfBirth` DATETIME(6) NOT NULL DEFAULT "1990-01-01 00:00:00" AFTER `DateOfJoining`',
    'SELECT "DateOfBirth column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add ManagerId column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'ManagerId'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `ManagerId` INT NULL AFTER `DateOfBirth`',
    'SELECT "ManagerId column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add DepartmentId column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DepartmentId'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DepartmentId` INT NOT NULL DEFAULT 1 AFTER `ManagerId`',
    'SELECT "DepartmentId column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add DesignationId column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DesignationId'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DesignationId` INT NOT NULL DEFAULT 1 AFTER `DepartmentId`',
    'SELECT "DesignationId column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add EmploymentType column if not exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'EmploymentType'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `EmploymentType` INT NOT NULL DEFAULT 0 AFTER `DesignationId`',
    'SELECT "EmploymentType column already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 5. CREATE EMPLOYEESKILLS JUNCTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `EmployeeSkills` (
    `EmployeeId` INT NOT NULL,
    `SkillId` INT NOT NULL,
    `ProficiencyLevel` INT NOT NULL DEFAULT 0, -- 0=Beginner, 1=Intermediate, 2=Expert
    `YearsOfExperience` DECIMAL(3,1) NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`EmployeeId`, `SkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Employees table indexes
CREATE INDEX IF NOT EXISTS `IX_Employees_DepartmentId` ON `Employees` (`DepartmentId`);
CREATE INDEX IF NOT EXISTS `IX_Employees_DesignationId` ON `Employees` (`DesignationId`);
CREATE INDEX IF NOT EXISTS `IX_Employees_ManagerId` ON `Employees` (`ManagerId`);
CREATE INDEX IF NOT EXISTS `IX_Employees_Email` ON `Employees` (`Email`);

-- EmployeeSkills table indexes
CREATE INDEX IF NOT EXISTS `IX_EmployeeSkills_SkillId` ON `EmployeeSkills` (`SkillId`);
CREATE INDEX IF NOT EXISTS `IX_EmployeeSkills_ProficiencyLevel` ON `EmployeeSkills` (`ProficiencyLevel`);

-- =====================================================
-- 7. ADD FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Employee Manager self-reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Employees'
    AND CONSTRAINT_NAME = 'FK_Employees_Employees_ManagerId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Employees` ADD CONSTRAINT `FK_Employees_Employees_ManagerId` FOREIGN KEY (`ManagerId`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL',
    'SELECT "FK_Employees_Employees_ManagerId already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Employee Department reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Employees'
    AND CONSTRAINT_NAME = 'FK_Employees_Departments_DepartmentId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Employees` ADD CONSTRAINT `FK_Employees_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT',
    'SELECT "FK_Employees_Departments_DepartmentId already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Employee Designation reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Employees'
    AND CONSTRAINT_NAME = 'FK_Employees_Designations_DesignationId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Employees` ADD CONSTRAINT `FK_Employees_Designations_DesignationId` FOREIGN KEY (`DesignationId`) REFERENCES `Designations` (`Id`) ON DELETE RESTRICT',
    'SELECT "FK_Employees_Designations_DesignationId already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Department Manager reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Departments'
    AND CONSTRAINT_NAME = 'FK_Departments_Employees_ManagerId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Departments` ADD CONSTRAINT `FK_Departments_Employees_ManagerId` FOREIGN KEY (`ManagerId`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL',
    'SELECT "FK_Departments_Employees_ManagerId already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- EmployeeSkills references
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'EmployeeSkills'
    AND CONSTRAINT_NAME = 'FK_EmployeeSkills_Employees_EmployeeId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `EmployeeSkills` ADD CONSTRAINT `FK_EmployeeSkills_Employees_EmployeeId` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees` (`Id`) ON DELETE CASCADE',
    'SELECT "FK_EmployeeSkills_Employees_EmployeeId already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'EmployeeSkills'
    AND CONSTRAINT_NAME = 'FK_EmployeeSkills_Skills_SkillId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `EmployeeSkills` ADD CONSTRAINT `FK_EmployeeSkills_Skills_SkillId` FOREIGN KEY (`SkillId`) REFERENCES `Skills` (`Id`) ON DELETE CASCADE',
    'SELECT "FK_EmployeeSkills_Skills_SkillId already exists" AS Result'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 8. SEED INITIAL DATA
-- =====================================================

-- Insert default departments
INSERT IGNORE INTO `Departments` (`Id`, `Name`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Information Technology', 'Software development and IT infrastructure', 1, 1),
(2, 'Human Resources', 'Employee relations and recruitment', 1, 1),
(3, 'Finance', 'Financial planning and accounting', 1, 1),
(4, 'Marketing', 'Marketing and business development', 1, 1),
(5, 'Operations', 'Business operations and project management', 1, 1);

-- Insert default designations
INSERT IGNORE INTO `Designations` (`Id`, `Name`, `Description`, `Level`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Software Engineer', 'Develops and maintains software applications', 'Junior', 1, 1),
(2, 'Senior Software Engineer', 'Lead developer with advanced technical skills', 'Senior', 1, 1),
(3, 'Tech Lead', 'Technical leadership and architecture decisions', 'Lead', 1, 1),
(4, 'Project Manager', 'Manages projects and coordinates teams', 'Manager', 1, 1),
(5, 'Business Analyst', 'Analyzes business requirements and processes', 'Analyst', 1, 1),
(6, 'HR Manager', 'Manages human resources and employee relations', 'Manager', 1, 1),
(7, 'DevOps Engineer', 'Manages infrastructure and deployment pipelines', 'Engineer', 1, 1),
(8, 'Quality Assurance Engineer', 'Tests and ensures quality of software products', 'Engineer', 1, 1),
(9, 'Solution Architect', 'Designs system architecture and technical solutions', 'Architect', 1, 1),
(10, 'Team Lead', 'Leads development teams and manages deliverables', 'Lead', 1, 1);

-- Insert default skills
INSERT IGNORE INTO `Skills` (`Id`, `Name`, `Category`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'C#', 'Programming Language', 'Microsoft C# programming language', 1, 1),
(2, 'ASP.NET Core', 'Framework', '.NET Core web application framework', 1, 1),
(3, 'React', 'Frontend Framework', 'JavaScript library for building user interfaces', 1, 1),
(4, 'TypeScript', 'Programming Language', 'Typed superset of JavaScript', 1, 1),
(5, 'SQL Server', 'Database', 'Microsoft SQL Server database management', 1, 1),
(6, 'MySQL', 'Database', 'Open source relational database', 1, 1),
(7, 'Entity Framework', 'ORM', 'Object-relational mapping framework for .NET', 1, 1),
(8, 'Azure', 'Cloud Platform', 'Microsoft Azure cloud services', 1, 1),
(9, 'Docker', 'Containerization', 'Container platform for applications', 1, 1),
(10, 'Kubernetes', 'Container Orchestration', 'Container orchestration platform', 1, 1),
(11, 'JavaScript', 'Programming Language', 'Dynamic programming language for web development', 1, 1),
(12, 'HTML/CSS', 'Web Technology', 'Web markup and styling technologies', 1, 1),
(13, 'Git', 'Version Control', 'Distributed version control system', 1, 1),
(14, 'Project Management', 'Soft Skill', 'Planning and managing project execution', 1, 1),
(15, 'Agile/Scrum', 'Methodology', 'Agile software development methodology', 1, 1),
(16, 'REST API', 'Architecture', 'RESTful web service architecture', 1, 1),
(17, 'Microservices', 'Architecture', 'Microservices architecture pattern', 1, 1),
(18, 'Node.js', 'Runtime', 'JavaScript runtime for server-side development', 1, 1),
(19, 'Angular', 'Frontend Framework', 'TypeScript-based web application framework', 1, 1),
(20, 'Python', 'Programming Language', 'High-level programming language', 1, 1);

-- =====================================================
-- 9. VERIFICATION AND REPORTING
-- =====================================================

-- Display migration results
SELECT 'Tables Created/Updated:' AS Status;
SELECT 
    TABLE_NAME, 
    ENGINE,
    TABLE_ROWS,
    DATA_LENGTH,
    CREATE_TIME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
AND TABLE_NAME IN ('Departments', 'Designations', 'Skills', 'EmployeeSkills', 'Employees')
ORDER BY TABLE_NAME;

SELECT 'Foreign Key Constraints:' AS Status;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
AND REFERENCED_TABLE_NAME IS NOT NULL
AND TABLE_NAME IN ('Employees', 'EmployeeSkills', 'Departments')
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

SELECT 'Seed Data Summary:' AS Status;
SELECT 'Departments' AS TableName, COUNT(*) AS RecordCount FROM `Departments`
UNION ALL
SELECT 'Designations' AS TableName, COUNT(*) AS RecordCount FROM `Designations`
UNION ALL
SELECT 'Skills' AS TableName, COUNT(*) AS RecordCount FROM `Skills`
UNION ALL
SELECT 'EmployeeSkills' AS TableName, COUNT(*) AS RecordCount FROM `EmployeeSkills`;

-- Final success message
SELECT 'SUCCESS: Department, Designation, Skill & EmployeeSkill migration completed!' AS Result;

-- =====================================================
-- END OF MIGRATION SCRIPT
-- =====================================================