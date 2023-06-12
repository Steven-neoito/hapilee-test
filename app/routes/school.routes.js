module.exports = (app) => {
  const school = require("../controllers/school.controller.js");

  var router = require("express").Router();

  //  =========== STUDENT ===========================
  // Create a new Student
  router.post("/create-student", school.createStudent);

  // Retrieve all studnets
  router.get("/students", school.findAllStudents);

  // update student by id
  router.patch("/update-student", school.updateStudent);

  // Retrieve students by name
  router.get("/students/:name", school.findStudentsByName);

  // Delete a Student by id
  router.delete("/student/:id", school.deleteStudentById);

  // get students by class_id
  router.get("/students-by-class/:id", school.getStudentsByClassId);

  // get unassigned students
  router.get("/unassigned-students", school.getUnassignedStudents);

  // =============== TEACHER ==============================
  // Create a new teacher
  router.post("/create-teacher", school.createTeacher);

  // Retrieve all teachers
  router.get("/teachers", school.findAllTeachers);

  // update teacher by id
  router.patch("/update-teacher", school.updateTeacher);

  // Delete a teacher by id
  router.delete("/teacher/:id", school.deleteTeacherById);

  // Retrieve teachers by name
  router.get("/teachers/:name", school.findTeachersByName);

  // =========== CLASS ===================================
  // Create a new class
  router.post("/create-class", school.createClass);

  // Retrieve all classes
  router.get("/classes", school.findAllClasses);

  // Retrieve class data
  router.get("/class-data/", school.getClassData);

  // update class by id
  router.patch("/update-class", school.updateClass);

  // update class by id
  router.post("/class/assign-class-teacher", school.assignClassTeacher);

  //assign classes
  router.post("/class/assign-classes", school.assignClasses);

  // get teachers assigned to a class
  router.get("/class/teachers/:id", school.teachingDataByClassId);

  // deletet class
  router.delete("/class/:id", school.deleteClassById);

  app.use("/api/school", router);
};
