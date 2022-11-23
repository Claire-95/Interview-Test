using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class EmployeesController : ControllerBase
    {

        private readonly ILogger<EmployeesController> _logger;
        public EmployeesController(ILogger<EmployeesController> logger){
            _logger = logger;
        }

        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

         

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = $@"SELECT Name, Value FROM Employees;";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1),
                        });
                    }
                    
                }
            }
            return (employees);
        }

        [Route("sum")]
        [HttpGet]
        public int GetSum()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = $@"SELECT IFNULL(SUM(Value), 0) FROM Employees WHERE Name LIKE 'A%'"; 
                Int64 sumA = (Int64) queryCmd.ExecuteScalar(); 
                queryCmd.CommandText = $@"SELECT IFNULL(SUM(Value), 0) FROM Employees WHERE Name LIKE 'B%'";
                Int64 sumB = (Int64) queryCmd.ExecuteScalar(); 
                queryCmd.CommandText = $@"SELECT IFNULL(SUM(Value), 0) FROM Employees WHERE Name LIKE 'C%'";
                Int64 sumC = (Int64) queryCmd.ExecuteScalar(); 

                long sumTotal = sumA + sumB + sumC;
                 


                return (Convert.ToInt32(sumTotal));
            }
        }

        [Route("{id?}")]
        [HttpDelete]
        public void DeleteValue(string id)
        {
            var logMessage = id;

            _logger.Log(LogLevel.Information, logMessage);
            
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = $@"DELETE FROM Employees WHERE Name='{id}'";
                queryCmd.ExecuteNonQuery();
            }
        }

        [Route("{id?}")]
        [HttpPost]
        public void PostValue([FromQuery]string name, [FromQuery]string value)
        {
            var logMessage = name;

            _logger.Log(LogLevel.Information, logMessage);

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = $@"INSERT INTO Employees (name, value) VALUES ('{name}', '{value}')";
                queryCmd.ExecuteNonQuery();
            }
        }

        [Route("{id?}")]
        [HttpPut]
        public void PutValue([FromQuery]string newName, [FromQuery]int newValue, [FromQuery]string oldName, [FromQuery]int oldValue)
        {
            var logMessage = newName;

            _logger.Log(LogLevel.Information, logMessage);

            string name;
            int value;

            if(newName == "0000"){
                name = oldName;
            } else 
            {name = newName;}

            if(newValue == 0000){
                value = oldValue;
            } else 
            {value = newValue;}

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = $@"UPDATE Employees SET name='{name}', value='{value}' WHERE name='{oldName}'";
                queryCmd.ExecuteNonQuery();
            }
        }


        [HttpPatch]
        public void PatchValue()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = $@"UPDATE Employees SET value=value+1 WHERE name LIKE 'E%'; 
                UPDATE Employees SET value=value+10 WHERE name LIKE 'G%'; 
                UPDATE Employees SET value=value+100 WHERE name NOT LIKE 'G%' AND name NOT LIKE 'E%';"; 
                queryCmd.ExecuteNonQuery();
            }
        }




    }

    

    
}
