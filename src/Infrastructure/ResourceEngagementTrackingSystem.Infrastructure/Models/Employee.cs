using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public enum EmploymentType
    {
        Permanent = 0,
        Contract = 1,
        Intern = 2
    }

    public class Employee : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string EmployeeCode { get; set; }
        [Required, MaxLength(100)]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required, MaxLength(100)]
        public string Email { get; set; }
        [MaxLength(20)]
        public string Phone { get; set; }
        public DateTime DateOfJoining { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int? ManagerId { get; set; }
        public Employee Manager { get; set; }
        public ICollection<Employee> Subordinates { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public int DesignationId { get; set; }
        public Designation Designation { get; set; }
        public EmploymentType EmploymentType { get; set; }
        public ICollection<EmployeeSkill> EmployeeSkills { get; set; }
    }
}