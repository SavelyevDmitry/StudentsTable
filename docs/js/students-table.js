(() => {
    const container = document.querySelector('.container');
    let currentStudents = JSON.parse(localStorage.getItem('students'));
    let filteredStudents = [];

    // Создание поля ввода
    function createInputGroup(inputType, inputName, text, placeholder = '') {
        const inputWrapper = document.createElement('div');
        const input = document.createElement('input');
        const inputLabel = document.createElement('label');

        inputWrapper.classList.add('form-group', 'row', 'mb-3');

        input.classList.add('col-sm-10', 'form-control');
        input.type = inputType;
        input.name = inputName;
        input.placeholder = placeholder;
        input.id = inputName;

        inputLabel.classList.add('col-sm', 'col-form-label', 'form__input-label');
        inputLabel.setAttribute('for', inputName);
        inputLabel.textContent = text;

        inputWrapper.append(inputLabel, input);

        return {
            inputWrapper,
            input
        }
    }

    // Функции валидации
    function isTextInputValid(input) {
        if (input.value.trim()) {
            input.classList.remove('is-invalid')
            input.classList.add('is-valid');
            return true;
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            return false;
        }
    }

    function isDateValid(input) {
        const date = Date.parse(input.value);
        const dateYear = new Date(Date.parse(input.value)).getFullYear();
        const currentDate = Date.now();

        if (dateYear < 1900  || date > currentDate) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            return {
                status: false,
                error: 'Дата рожения должна быть в пределах от 1900 г. до текущей даты'
            };
        } else if (Number.isNaN(dateYear)) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            return {
                status: false,
                error: 'Дата рожения должна быть заполнена'
            };
        } else {
            input.classList.remove('is-invalid')
            input.classList.add('is-valid');
            return {
                status: true,
                error: ''
            }
        }
    }

    function isYearEducationValid(input) {
        const currentYear = new Date(Date.now(Date.now())).getFullYear();
        const currentMonth = new Date(Date.now(Date.now())).getMonth();

        if (input.value < 2000) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');

            return {
                status: false,
                error: 'Год начала обучения должен быть позже 2000 г.'
            };
        } else if (input.value > currentYear) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');

            return {
                status: false,
                error: 'Год начала обучения должен быть не больше текущего'
            };
        } else if (input.value == currentYear && currentMonth < 8) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');

            return {
                status: false,
                error: 'Недопустимый год начала обучения. Текущий учебный год еще не начат.'
            };
        } else {
            input.classList.remove('is-invalid')
            input.classList.add('is-valid');

            return {
                status: true,
                error: ''
            };
        }
    }

    // Сортировка студентов
    function sortFilter(type) {
        let studentsArr;
        if(filteredStudents.length > 0) {
            studentsArr = filteredStudents;
        } else {
            studentsArr = currentStudents.slice();
        }

        switch (type) {
            case 'fullName':
                studentsArr.sort((firstStudent, secondStudent) => {
                    for (let i = 0; i < Math.min(firstStudent.fullName.length, secondStudent.fullName.length); i++) {
                        if (firstStudent.fullName[i] > secondStudent.fullName[i]) {
                            return 1;
                        } else if (firstStudent.fullName[i] < secondStudent.fullName[i]) {
                            return -1;
                        }
                    }

                    if (firstStudent.fullName.length > secondStudent.fullName.length) {
                        return 1;
                    } else if (firstStudent.fullName.length < secondStudent.fullName.length) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                tableRepaint(true, studentsArr);
                break;

            case 'faculty': 
                studentsArr.sort((firstStudent, secondStudent) => {
                    for (let i = 0; i < Math.min(firstStudent.faculty.length, secondStudent.faculty.length); i++) {
                        if (firstStudent.faculty[i] > secondStudent.faculty[i]) {
                            return 1;
                        } else if (firstStudent.faculty[i] < secondStudent.faculty[i]) {
                            return -1;
                        }
                    }

                    if (firstStudent.faculty.length > secondStudent.faculty.length) {
                        return 1;
                    } else if (firstStudent.faculty.length < secondStudent.faculty.length) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                tableRepaint(true, studentsArr);
                break;

            case 'birthday':
                studentsArr.sort((firstStudent, secondStudent) => { 
                    if (firstStudent.birthday.year > secondStudent.birthday.year) {
                        return 1;
                    } else if (firstStudent.birthday.year < secondStudent.birthday.year) {
                        return -1;
                    } else {
                        if (firstStudent.birthday.month > secondStudent.birthday.month) {
                            return 1;
                        } else if (firstStudent.birthday.month < secondStudent.birthday.month) {
                            return -1;
                        } else { 
                            if (firstStudent.birthday.day > secondStudent.birthday.day) {
                                return 1;
                            } else if (firstStudent.birthday.day < secondStudent.birthday.day) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                    }
                });
                tableRepaint(true, studentsArr);
                break;

            case 'yearStartEducation':
                studentsArr.sort((firstStudent, secondStudent) => {
                    if (firstStudent.yearStartEducation > secondStudent.yearStartEducation) {
                        return 1;
                    } else if (firstStudent.yearStartEducation < secondStudent.yearStartEducation) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                tableRepaint(true, studentsArr);
                break;
            default:
                break;
        }
    }

    //Функция фильтрации по введенному значению
    function searchFilter(fullName, faculty, startEducation, endEducation) {

        if (!fullName && !faculty && !startEducation && !endEducation) {
            tableRepaint(false)

            filteredStudents = [];

            return;
        }
        if (!(filteredStudents.length > 0)) {
            filteredStudents = currentStudents;
        }
       
        if (fullName) {
            filteredStudents = filteredStudents.filter(student => student.fullName.toLowerCase().includes(fullName.toLowerCase()));
        }

        if (faculty) {
            filteredStudents = filteredStudents.filter(student => student.faculty.toLowerCase().includes(faculty.toLowerCase()));
        }

        if (startEducation) {
            filteredStudents = filteredStudents.filter(student => student.yearStartEducation === parseInt(startEducation));
        }

        if (endEducation) {
            filteredStudents = filteredStudents.filter(student => student.yearStartEducation + 4 === parseInt(endEducation));
        }

        tableRepaint(true, filteredStudents);
    }

    // Создание формы
    function createStudentForm() {
        const form = document.createElement('form');
        const formTitle = document.createElement('h2');

        const firstName = createInputGroup('text', 'firstName', 'Имя', 'Имя');
        const secondName = createInputGroup('text', 'secondName', 'Фамилия', 'Фамилия');
        const middleName = createInputGroup('text', 'middleName', 'Отчество', 'Отчество');
        const birthday = createInputGroup('date', 'birthday', 'День рождения');
        const yearStartEducation = createInputGroup('number', 'yearStartEducation', 'Год начала обучения', 'Год');
        const faculty = createInputGroup('text', 'faculty', 'Факультет', 'Факультет');
        const labelValidate = document.createElement('p');

        formTitle.textContent = 'Добавление студента в таблицу';
        formTitle.classList.add('text-center', 'mb-4', 'display-6');

        const buttonWrapper = document.createElement('div');
        const button = document.createElement('button');

        buttonWrapper.classList.add('d-flex', 'flex-column', 'align-items-center');
        button.classList.add('btn', 'btn-primary', 'mr-3');
        button.textContent = 'Добавить';

        labelValidate.classList.add('text-danger', 'font-weight-bolder', 'm-0', 'mb-3', 'fs-1');

        buttonWrapper.append(labelValidate, button);

        form.append(formTitle, secondName.inputWrapper, firstName.inputWrapper, middleName.inputWrapper, birthday.inputWrapper, yearStartEducation.inputWrapper, faculty.inputWrapper, buttonWrapper);
        form.classList.add('form-group', 'mb-4');

        form.addEventListener('submit', e => {
            e.preventDefault();

            const isFirstNameValid = isTextInputValid(firstName.input);
            const isSecondNameValid = isTextInputValid(secondName.input);
            const isMiddleNameValid = isTextInputValid(middleName.input);
            const isFacultyValid = isTextInputValid(faculty.input);
            const isBirthdayValid = isDateValid(birthday.input);
            const isEducationValid = isYearEducationValid(yearStartEducation.input);

            if (!(isFirstNameValid && isSecondNameValid && isMiddleNameValid && isFacultyValid)) {
                labelValidate.textContent = 'Заполните все текстовые поля';
                return;

            } else if (!isBirthdayValid.status) {
                labelValidate.textContent = isBirthdayValid.error;
                return;

            } else if (!isEducationValid.status) {
                labelValidate.textContent = isEducationValid.error;
                return;

            } else {
                labelValidate.textContent = '';
                firstName.input.classList.remove('is-valid');
                secondName.input.classList.remove('is-valid');
                middleName.input.classList.remove('is-valid');
                birthday.input.classList.remove('is-valid');
                yearStartEducation.input.classList.remove('is-valid');
                faculty.input.classList.remove('is-valid');
            }

            const student = {};
            const tableBody = document.getElementsByTagName('tbody');

            const birthdayDate = new Date(Date.parse(birthday.input.value));

            if(currentStudents.length > 0) {
                student.id = currentStudents[currentStudents.length - 1].id + 1;
            } else {
                student.id = 1;
            }

            student.fullName = `${secondName.input.value.trim()} ${firstName.input.value.trim()} ${middleName.input.value.trim()}`;
            student.birthday = {
                year: birthdayDate.getFullYear(),
                month: birthdayDate.getMonth(),
                day: birthdayDate.getDate()
            }
            student.yearStartEducation = yearStartEducation.input.valueAsNumber;
            student.faculty = faculty.input.value.trim();
  
            const tableRow = createTableRow(student);
            tableBody[0].append(tableRow);

            currentStudents.push(student);
            localStorage.setItem('students', JSON.stringify(currentStudents));

            firstName.input.value = '';
            secondName.input.value = '';
            middleName.input.value = '';
            birthday.input.value = '';
            yearStartEducation.input.value = '';
            faculty.input.value = '';
        })
 
        return form;
    }

    function createSearchForm() {
        const searchForm = document.createElement('form');
        const serachFormTitle = document.createElement('h2');

        const searchFullName = createInputGroup('text', 'searchFulName', 'ФИО', 'ФИО');
        const searchFaculty = createInputGroup('text', 'searchFaculty', 'Факультет', 'Факультет');
        const searchStartYear = createInputGroup('number', 'searchStartYear', 'Год начала обучения', 'Год');
        const searchFinishYear = createInputGroup('number', 'searchFinishYear', 'Год окончания', 'Год');

        searchForm.classList.add('form-group', 'mb-5');
        serachFormTitle.textContent = 'Форма поиска студента в таблице';
        serachFormTitle.classList.add('text-center', 'mb-4', 'display-6');

        searchForm.append(serachFormTitle, searchFullName.inputWrapper, searchFaculty.inputWrapper, searchStartYear.inputWrapper, searchFinishYear.inputWrapper);

        searchFullName.input.addEventListener('input', () => {
            searchFilter(searchFullName.input.value, searchFaculty.input.value, searchStartYear.input.value, searchFinishYear.input.value);
        })

        searchFaculty.input.addEventListener('input', () => {
            searchFilter(searchFullName.input.value, searchFaculty.input.value, searchStartYear.input.value, searchFinishYear.input.value);
        })

        searchStartYear.input.addEventListener('input', () => {
            searchFilter(searchFullName.input.value, searchFaculty.input.value, searchStartYear.input.value, searchFinishYear.input.value);
        })

        searchFinishYear.input.addEventListener('input', () => {
            searchFilter(searchFullName.input.value, searchFaculty.input.value, searchStartYear.input.value, searchFinishYear.input.value);
        })

        return searchForm;
    }

    function getBirthdayInfo(birthday) {
        const currentDate = new Date(Date.now());
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        let age = currentYear - birthday.year;

        if (!((currentMonth - birthday.month > 0) || (currentMonth - birthday.month === 0 && currentDay - birthday.day >= 0))) {
            age--;
        }

        let birthdayInfo;

        if (birthday.month < 10) {
            birthdayInfo = `${birthday.day}.0${birthday.month + 1}.${birthday.year} (${age}`;
        } else {
            birthdayInfo = `${birthday.day}.${birthday.month + 1}.${birthday.year} (${age}`;
        }

        const ageEnd = age % 10;
        switch (ageEnd) {
            case 1:
                birthdayInfo += ' год)';
                break;
            case 2:
            case 3:
            case 4:
                birthdayInfo += ' года)';
                break;
            default:
                birthdayInfo += ' лет)';
                break;
        }

        return birthdayInfo;
    }

    function getEducationInfo(yearStartEducation) {
        const yearEndEducation = yearStartEducation + 4;
        const currentDate = new Date(Date.now());
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        course = currentYear - yearStartEducation + 1;
        let educationInfo;

        if (course > 4) {
            educationInfo = `${yearStartEducation}-${yearEndEducation} (закончил)`;
        } else if(currentMonth < 8) {
            course--;
            educationInfo = `${yearStartEducation}-${yearEndEducation} (${course} курс)`;
        }

        

        return educationInfo;
    }

    function createTableHeaderRow(fullName, faculty, birthday, year) {
        const row = document.createElement('tr');
        const colFullName = document.createElement('th');
        const colFaculty = document.createElement('th');
        const colAge = document.createElement('th');
        const colEducation = document.createElement('th');
        const colDelete = document.createElement('th');

        colFullName.textContent = fullName;
        colFaculty.textContent = faculty;
        colAge.textContent = birthday;
        colEducation.textContent = year; 
        // colDelete.textContent = '#';

        row.append(colFullName, colFaculty, colAge, colEducation, colDelete);

        colFullName.addEventListener('click', () => {
            sortFilter('fullName');
        });

        colFaculty.addEventListener('click', () => {
            sortFilter('faculty');
        });

        colAge.addEventListener('click', () => {
            sortFilter('birthday');
        });

        colEducation.addEventListener('click', () => {
            sortFilter('yearStartEducation');
        });
        
        return row;
    }

    function createTableRow(student) {
        const row = document.createElement('tr');
        const colFullName = document.createElement('td');
        const colFaculty = document.createElement('td');
        const colAge = document.createElement('td');
        const colEducation = document.createElement('td');
        const colDelete = document.createElement('td');
        const deleteButton = document.createElement('button');

        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('btn', 'btn-link', 'btn-sm');

        colFullName.textContent = student.fullName;
        colFaculty.textContent = student.faculty;
        colAge.textContent = getBirthdayInfo(student.birthday);
        colEducation.textContent = getEducationInfo(student.yearStartEducation);
        colDelete.append(deleteButton); 

        row.append(colFullName, colFaculty, colAge, colEducation, colDelete);

        deleteButton.addEventListener('click', () => {
            if (confirm('Вы точно хотите удалить этого студента из таблицы?')) {
                row.remove();

                const rowIndex = currentStudents.findIndex(studentItem => studentItem.id === student.id);
                currentStudents.splice(rowIndex, 1);

                localStorage.setItem('students', JSON.stringify(currentStudents));
            }
        })

        return row;
    }

    function tableRepaint(isFiltered, studentsData = []) {
        let table = document.querySelector('.table');

        table.remove();
        if (isFiltered) {
            table = createStudentsTable(true, studentsData);
        } else {
            table = createStudentsTable(false);
        }
        container.append(table);
    }

    function createStudentsTable(isFiltered, studentsData = []) {
        const table = document.createElement('table');
        const tableHeader = document.createElement('thead');
        const tableBody = document.createElement('tbody');

        const tableHeaderRow = createTableHeaderRow('ФИО', 'Факультет', 'ДР и возраст', 'Годы обучения');

        if (!isFiltered && currentStudents) {
            currentStudents.forEach(student => {
                const tableRow = createTableRow(student);
                tableBody.append(tableRow);
            });
        } else if(!currentStudents) {
            currentStudents = [];
        }

        studentsData.forEach(student => {
            const tableRow = createTableRow(student);
            tableBody.append(tableRow);
            if (!isFiltered) {
                currentStudents.push(student);
                localStorage.setItem('students', JSON.stringify(currentStudents));
            }        
        })     

        table.classList.add('table', 'table-bordered', 'table-hover')
        tableHeader.append(tableHeaderRow);
        table.append(tableHeader, tableBody);

        return table;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const studentForm = createStudentForm();
        const searchForm = createSearchForm();
        const tableTitle = document.createElement('h2');
        const studentsTable = createStudentsTable(false);

        console.log(currentStudents);

        tableTitle.textContent = 'Таблица студентов';
        tableTitle.classList.add('text-center', 'mb-4', 'display-6');

        container.append(studentForm, searchForm, tableTitle, studentsTable);
    });

})();
