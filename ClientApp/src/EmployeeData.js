import { useState } from "react";
import { EmployeeTable } from "./EmployeeTable";
import { SetSum } from "./EmployeeTable";

var SetEmployeesCallback;

function EmployeeData() {
  const [employees, setEmployees] = useState([]);
  SetEmployeesCallback = setEmployees;
  if (employees.length === 0) GetEmployees();
  return EmployeeTable(employees);
}

function GetEmployees() {
  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    var employeeList = JSON.parse(this.response);
    let i = 0;
    employeeList.map((n) => {
      n["id"] = i;
      i = i + 1;
    });
    SetEmployeesCallback(employeeList);
  };

  xhttp.open("GET", "employees");
  xhttp.send();
}

function GetSum() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    SetSum(this.response);
  };
  xhttp.open("GET", "employees/sum");
  xhttp.send();
}

function AddEmployee(name, value) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", `employees?Name=${name}&Value=${value}`);
  xhttp.onload = function () {
    GetEmployees();
    GetSum();
  };
  xhttp.send();
}

function EditEmployee(oldName, oldValue, newName, newValue) {
  if (newValue == "") {
    newValue = "0000";
  }
  if (newName == "") {
    newName = "0000";
  }

  newValue = parseInt(newValue);
  oldValue = parseInt(oldValue);

  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "PUT",
    `employees?NewName=${newName}&NewValue=${newValue}&OldName=${oldName}&OldValue=${oldValue}`
  );
  xhttp.onload = function () {
    GetEmployees();
    GetSum();
  };
  xhttp.send();
}

function RunSql() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PATCH", "employees");
  xhttp.onload = function () {
    GetSum();
    GetEmployees();
  };
  xhttp.send();
}

export {
  EmployeeData,
  AddEmployee,
  EditEmployee,
  RunSql,
  GetSum,
  SetEmployeesCallback,
};
