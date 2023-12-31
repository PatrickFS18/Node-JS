const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const Employee = require("../models/employee")(sequelize, Sequelize); // Passando os parâmetros necessários
const { calculateIRF } = require("../utils");
const { Op } = Sequelize;

// Resto do código do controller...

exports.home = (req, res) => {
  res.render("myform", { layout: false });
};

exports.listarEmpregados = (req, res) => {
  Employee.findAll()
    .then((employees) => {
      employees = employees.map((employee) => {
        const inss = employee.salario_bruto * 0.11;
        const irpf = calculateIRF(employee.salario_bruto);
        const salario_liquido = (employee.salario_bruto - inss - irpf).toFixed(2);

        employee.salario_liquido = salario_liquido;

        if (employee.departamento == 1) {
          employee.departamento = "Administrativo";
        } else if (employee.departamento == 2) {
          employee.departamento = "Designer";
        } else if (employee.departamento == 3) {
          employee.departamento = "Contabil";
        } else {
          employee.departamento = "Fábrica";
        }
        return employee;
      });

      res.render("list", { employees }); // Renderiza uma página com a lista de funcionários
    })
    .catch((error) => {
      res.render("list", { error }); // Renderiza uma página de erro
    });
};

exports.adicionar = (req, res) => {
  // Capturar os dados do formulário
  const nome = req.body.nome;
  const salario_bruto = parseFloat(req.body.salario_bruto);
  const departamento = parseInt(req.body.departamento);

  // Agora, você pode usar os dados capturados para criar um novo registro no banco de dados usando o Sequelize
  Employee.create({
    nome: nome,
    salario_bruto: salario_bruto,
    departamento: departamento,
  })
    .then(() => {
      // Redirecionar ou renderizar uma página de sucesso
      res.redirect("/");
    })
    .catch((err) => {
      // Lidar com erros, redirecionar para uma página de erro, etc.
      res.render("myform", { layout: false, err: err });
    });
};
exports.showAllQuestions = (req, res) => {
  // Consulta para encontrar o funcionário com maior salário
  Employee.findOne({
    order: [["salario_bruto", "DESC"]],
  }).then((highestPaidEmployee) => {
    // Consulta para encontrar o funcionário com menor salário
    Employee.findOne({
      order: [["salario_bruto", "ASC"]],
    }).then((lowestPaidEmployee) => {
      // Consulta para contar funcionários no setor administrativo
      Employee.count({
        where: {
          departamento: 1, // Supondo que o departamento administrativo tenha o valor 1
        },
      }).then((adminCount) => {
        // Consulta para agrupar funcionários por departamento e contar
        Employee.findAll({
          order: [["departamento", "ASC"]],
        }).then((departments) => {
          // Mapear os valores numéricos dos departamentos para os nomes correspondentes
          const departmentNamesMap = {
            1: "Administrativo",
            2: "Designer",
            3: "Contabil",
            4: "Fábrica",
          };

          const departmentsWithNames = departments.map((department) => {
            const departmentName = departmentNamesMap[department.departamento];
            return {
              ...department.dataValues,
              departmentName: departmentName,
            };
          });

          // Agora, vamos buscar todos os funcionários com o salário mais baixo
          Employee.findAll({
            where: { salario_bruto: lowestPaidEmployee.salario_bruto },
          }).then((employeesWithLowestSalary) => {
            // Renderiza a página com os resultados de todas as consultas
            res.render("search", {
              highestSalary: highestPaidEmployee.nome,
              lowestSalary: lowestPaidEmployee.nome,
              adminCount: adminCount,
              sortedByDepartment: departmentsWithNames,
              employeesWithLowestSalary: employeesWithLowestSalary,
            });
          });
        });
      });
    });
  });
};

// Função auxiliar para obter o nome do departamento com base no valor numérico
function getDepartmentName(departmentValue) {
  if (departmentValue === 1) {
    return "Administrativo";
  } else if (departmentValue === 2) {
    return "Designer";
  } else if (departmentValue === 3) {
    return "Contabil";
  } else {
    return "Fábrica";
  }
}

exports.searchByName = (req, res) => {
  const query = `%${req.body.nome}%`;
  Employee
    .findAll({
      where: {
        nome: { [Op.like]: query },
      },
      order: [["id", "ASC"]],
    })
    .then((employeeNames) => {
      res.render("search", { searchResults: employeeNames });
    })
    .catch((err) => {
      console.log("Error" + err);
      res.status(500).send({ message: "Error" + err.message });
    });
};
