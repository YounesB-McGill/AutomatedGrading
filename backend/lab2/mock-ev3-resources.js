#!/usr/bin/env node

"use strict";

const fs = require('fs');

/** Path to `Resources.java` */
const RESOURCES_SRC = "Resources_java_as_submitted_by_student.java";
const RESOURCES_DEST = "src/ca/mcgill/ecse211/project/Resources.java";

const resources = fs.readFileSync(RESOURCES_SRC, "utf8");

const lejosHardwareClassNames = resources.split(";")
    .filter(line => line.includes("import") && line.includes("lejos.hardware."))
    .map(line => line.split(".").slice(-1)[0]);

const mock = resources.split(";")
    .map(line => {
      if (line.includes("package ")) {
        return line + ";\n\nimport static org.mockito.Mockito.*;\nimport org.mockito.stubbing.*";
      }

      if (line.includes("public class Resources {")) {
        const [start, end] = line.split("public class Resources {");
        return start + "public class Resources {\n" + getTachoStateVarsAndFakeExceptionDefinition() + end;
      }

      const name = lejosHardwareClassNames.find(name => line.includes(name));
      if (name !== undefined) {
        if (line.includes("=")) {
          const tokens = line.split(" ").filter(t => t != "");
          const equalsIndex = tokens.findIndex(t => t.includes("="));
          const target = lejosHardwareClassNames.includes(tokens[equalsIndex - 1])?
              tokens[equalsIndex - 1] : tokens[equalsIndex - 2];

          const leftHandSide = line.split("=")[0];

          const result = leftHandSide + `= mock(${target}.class)`;
          if (target.includes("Motor")) {
            const motorName = lejosHardwareClassNames.includes(tokens[equalsIndex])?
                tokens[equalsIndex] : tokens[equalsIndex - 1]; 
            return result + ";" + getMotorMockCondition(motorName);
          }

          return result;
        }
      }
      return line;      
    })
    .reduce((acc, cur) => acc + cur + ";", "");

function getTachoStateVarsAndFakeExceptionDefinition() {
  return `
  class FakeException extends RuntimeException {}
  static int leftTacho = 0;
  static int rightTacho = 0;
  `;
}

function getMotorMockCondition(motorName) {
  const tachoVar = motorName.toLowerCase().includes("l")? "leftTacho" : "rightTacho";
  return `
  {
    when(${motorName}.getTachoCount()).thenAnswer((Answer<?>) inv -> { return ${tachoVar}; });
    doThrow(FakeException.class).when(${motorName}).forward();
  }`;
}

console.log(mock);

fs.writeFileSync(RESOURCES_DEST, mock);
