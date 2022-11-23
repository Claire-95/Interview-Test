import React, { useState } from "react";
import { RunSql, SetEmployeesCallback } from "./EmployeeData";
import { AddEmployee } from "./EmployeeData";
import { EditEmployee } from "./EmployeeData";
import { GetSum } from "./EmployeeData";

var SetIsModifyingCallback;
var SetOldNameCallback;
var SetOldValueCallback;
var SetSumCallback;

function EmployeeTable(props) {
  const [isModifying, setIsModifying] = useState(false);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [oldName, setOldName] = useState("");
  const [oldValue, setOldValue] = useState("");
  const [sum, setSum] = useState("");

  SetIsModifyingCallback = setIsModifying;
  SetOldNameCallback = setOldName;
  SetOldValueCallback = setOldValue;
  SetSumCallback = setSum;

  const rawList = [];
  for (const i in props) {
    rawList.push(props[i]);
  }

  const DataTable = rawList.map((info) => {
    return (
      <tr key={info.id}>
        <td>{info.name}</td>
        <td>{info.value}</td>

        <td>
          <button
            onClick={() => {
              EditEmployeeHandler(info.id, info.name, info.value, rawList);
            }}
            style={{ margin: "10px" }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              DeleteEmployeeHandler(info.id, info.name, rawList);
            }}
            style={{ margin: "10px" }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  var sumValue = (
    <p>
      Sum of all Values for all Names that begin with A, B or C only present
      when the summed values are greater than or equal to 11171: {sum}
    </p>
  );

  if (sum <= 11171) {
    sumValue = "";
  }

  if (isModifying == false) {
    return (
      <div>
        {sumValue}

        <h3>Run SQL:</h3>
        <p>
          This button will increment the field Value by 1 where the field Name
          begins with "E" and by 10 where Name begins with "G" and all others by
          100
        </p>
        <button
          onClick={() => {
            RunSql();
          }}
        >
          Run SQL
        </button>
        <Form />
        <br></br>
        <h3>Employee List:</h3>
        <table>
          <tbody>
            <tr>
              <th style={{ position: "absolute" }}>Name</th>
              <th>Value</th>
            </tr>
            {DataTable}
          </tbody>
        </table>
      </div>
    );
  } else {
    const handleSubmit = (event) => {
      event.preventDefault();
      EditEmployee(oldName, oldValue, newName, newValue);
      SetIsModifyingCallback(false);
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
          <h3>Edit Selected Employee:</h3>
          <label>
            Enter New Name:
            <input
              type="text"
              placeholder={oldName}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
          <br></br>
          <br></br>
          <label>
            Enter New Value:
            <input
              type="text"
              placeholder={oldValue}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </label>
          <br></br>
          <br></br>
          <input type="submit" value={"Update Employee"} />
        </form>
        <button
          onClick={() => {
            SetIsModifyingCallback(false);
          }}
        >
          Cancel
        </button>
      </>
    );
  }
}

function Form() {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    AddEmployee(name, value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Employee:</h3>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Value:
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
  );
}

function SetSum(sum) {
  SetSumCallback(sum);
}

function EditEmployeeHandler(id, oldName, oldValue, data) {
  SetIsModifyingCallback(true);
  SetOldNameCallback(oldName);
  SetOldValueCallback(oldValue);
}

function DeleteEmployee(name) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    GetSum();
  };

  xhttp.open("DELETE", "employees/" + name);
  xhttp.send();
}

function DeleteEmployeeHandler(id, name, DataTable) {
  for (var i = 0; i < DataTable.length; i++) {
    if (DataTable[i].id == id) {
      DataTable.splice(i, 1);
    }
  }

  SetEmployeesCallback(DataTable);
  DeleteEmployee(name);
}

export { EmployeeTable, SetSum };
