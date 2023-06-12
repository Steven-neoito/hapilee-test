const { QueryTypes } = require("sequelize");
const db = require("../models");
const Student = db.school.Students;
const Teacher = db.school.Teacher;
const Class = db.school.Class;
const Teaching = db.school.Teaching;
const sequelize = db.sequelize;

// Create and Save a new student
exports.createStudent = async (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.class_id) {
    res.status(400).send({
      message: "Invalid payload",
    });
    return;
  }

  // Create a student
  const student = {
    name: req.body.name,
    joined_at: new Date(),
    class_id: req.body.class_id ? req.body.class_id : null,
  };

  // Save student in the database
  try {
    const createdStudent = await Student.create(student);
    res.send(createdStudent);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the student.",
    });
  }
};

// Retrieve all students from the database.
exports.findAllStudents = async (req, res) => {
  try {
    const allStudents = await Student.findAll({
      attributes: ["id", "name", "class_id", "joined_at"],
      order: [["joined_at", req.query.sort ? req.query.sort : "DESC"]],
    });
    res.send(allStudents);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the student.",
    });
  }
};

// Update a student by id
exports.updateStudent = async (req, res) => {
  try {
    const { id, name } = req.body;

    const [num] = await Student.update(
      { name: name },
      {
        where: { id: id },
      }
    );

    if (num === 1) {
      res.send({
        message: "Student was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Student with id=${id}. Maybe Student was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

// Delete a student by Id
exports.deleteStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Student.destroy({
      where: { id: id },
    });

    console.log("num", num);

    if (num === 1) {
      res.send({
        message: "Student was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Student with id=${id}. Maybe Student was not found!`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

exports.findStudentsByName = async (req, res) => {
  try {
    const name = req.params.name;
    let orderby;
    if (req.query.sort) {
      orderby = `ORDER BY joined_at ${req.query.sort}`;
    } else {
      orderby = "ORDER BY joined_at DESC";
    }

    const query = `
    SELECT id, name, class_id, joined_at 
    FROM students 
    WHERE name ILIKE :name
    ${orderby}`;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { name: `%${name}%` },
    });

    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

exports.getStudentsByClassId = async (req, res) => {
  try {
    const class_id = req.params.id;

    const students = await Student.findAll({
      where: {
        class_id,
      },
      attributes: ["id", "name", "class_id", "joined_at"],
      order: [["joined_at", req.query.sort ? req.query.sort : "DESC"]],
    });

    res.send(students);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

exports.getUnassignedStudents = async (req, res) => {
  try {
    const unassignedStudents = await Student.findAll({
      where: {
        class_id: null,
      },
      order: [["joined_at", req.query.sort ? req.query.sort : "DESC"]],
    });

    res.send(unassignedStudents);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Create and Save a new teacher
exports.createTeacher = async (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.subject) {
    res.status(400).send({
      message: "Invalid payload",
    });
    return;
  }

  // Create a teacher
  const teacher = {
    name: req.body.name,
    subject: req.body.subject,
  };

  // Save teacher in the database
  try {
    const createdTeacher = await Teacher.create(teacher);
    res.send({
      id: createdTeacher.id,
      name: createdTeacher.name,
      subject: createdTeacher.subject,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the student.",
    });
  }
};

// get all teachers
exports.findAllTeachers = async (req, res) => {
  try {
    const allTeachers = await Teacher.findAll({
      attributes: ["id", "name", "subject"],
    });
    res.send(allTeachers);
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

// Update a teacher by id
exports.updateTeacher = async (req, res) => {
  try {
    if (!req.body.id) {
      res.status(400).send({ message: "Invalid Payload" });
    }
    const obj = {};
    req.body?.name ? (obj["name"] = req.body?.name) : null;
    req.body?.subject ? (obj["subject"] = req.body?.subject) : null;

    const [num] = await Teacher.update(obj, {
      where: { id: req.body.id },
    });

    if (num === 1) {
      res.send({
        message: "Teacher was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Teacher!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

// Delete a student by Id
exports.deleteTeacherById = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Teacher.destroy({
      where: { id: id },
    });

    if (num === 1) {
      res.send({
        message: "Teacher was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Teacher!`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

exports.findTeachersByName = async (req, res) => {
  try {
    const name = req.params.name;

    const query = `
    SELECT id, name, subject 
    FROM teachers 
    WHERE name ILIKE :name`;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { name: `%${name}%` },
    });

    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

// Create and Save a new class
exports.createClass = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Invalid payload",
    });
    return;
  }

  // Create a student
  const newClass = {
    name: req.body.name,
  };

  if (req.body.class_teacher) {
    newClass["class_teacher"] = req.body.class_teacher;
  }

  // Save class in the database
  try {
    const createdClass = await Class.create(newClass);
    req.body.class_teacher
      ? await Teaching.create({
          class_id: createdClass.id,
          teacher_id: req.body.class_teacher,
        })
      : null;
    res.send({
      id: createdClass.id,
      name: createdClass.name,
      class_teacher: createdClass.class_teacher,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the student.",
    });
  }
};

// Retrieve all students from the database.
exports.findAllClasses = async (req, res) => {
  try {
    const allClasses = await Class.findAll({
      attributes: ["id", "name", "class_teacher"],
    });
    res.send(allClasses);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the student.",
    });
  }
};

// Update a clas by id
exports.updateClass = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send({ message: "Invalid Payload" });
    }
    const obj = {};
    req.body?.name ? (obj["name"] = req.body?.name) : null;
    req.body?.class_teacher
      ? (obj["class_teacher"] = req.body?.class_teacher)
      : null;
    const [num] = await Class.update(obj, {
      where: { id: req.body.id },
    });

    if (num === 1) {
      res.send({
        message: "Class was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Class!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

exports.getClassData = async (req, res) => {
  try {
    const class_id = req.params.id;
    const query = `SELECT c.id, t.name as class_teacher, (
      SELECT COUNT(*)
      FROM students
      WHERE class_id = c.id
    ) AS students_count
FROM classes c
LEFT JOIN teachers t ON c.class_teacher = t.id`;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

exports.assignClassTeacher = async (req, res) => {
  try {
    if (!req.body.class_id || !req.body.teacher_id) {
      res.status(400).send({ message: "Invalid Payload" });
    }

    const class_id = req.body.class_id;
    const teacher_id = req.body.teacher_id;

    await Class.update(
      { class_teacher: teacher_id },
      { where: { id: class_id } }
    );

    res.send({ message: "Class teacher updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

exports.assignClasses = async (req, res) => {
  try {
    if (
      !req.body.class_ids ||
      req.body.class_ids.length == 0 ||
      !req.body.teacher_id
    ) {
      res.status(400).send({ message: "Invalid Payload" });
    }

    const teacher_id = req.body.teacher_id;

    const data = [];
    for (const class_id of req.body.class_ids) {
      data.push({
        class_id,
        teacher_id,
      });
    }
    await Teaching.bulkCreate(data);

    res.send({ message: "Class teacher updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

exports.teachingDataByClassId = async (req, res) => {
  try {
    const class_id = req.params.id;
    const query = `
    select t.id , c.name as class_name,  t2.name as teacher, t2.subject  from public.teachings t 
    inner join public.teachers t2 on t2.id = t.teacher_id 
    inner join public.classes c on c.id = t.class_id 
    where class_id = '${class_id}'`;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const obj = { teachers: [] };
    for (const item of results) {
      obj["class_name"] ? null : (obj["class_name"] = item.class_name);
      obj["teachers"].push({ teacher: item.teacher, subject: item.subject });
    }

    res.send(obj);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

exports.deleteClassById = async (req, res) => {
  try {
    const num = await Class.destroy({
      where: { id: req.params.id },
    });

    if (num === 1) {
      res.send({
        message: "Class was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Class!`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
