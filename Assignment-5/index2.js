const addExpancebtn = document.getElementById('add_btn');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close');
const submit_form = document.getElementById('submit_form');
const expance__list = document.querySelector('.expance__list');
const expanceCategoryChart = document.getElementById('piechart');
const expanceMonthChart = document.getElementById('linechart');
const totalamt = document.getElementById('total');
const inputs = document.querySelector('.expanceform').querySelectorAll('input');
const SearchInput = document.getElementById('search');
const search_btn = document.querySelector('.search_btn');

let CategoryChart;
let MonthChart;

let expensesDetails = [];

const defaultSearchMsg = document.createElement('p');
defaultSearchMsg.innerHTML = 'No result found!';
expance__list.appendChild(defaultSearchMsg);
defaultSearchMsg.style.display = 'none';

document.addEventListener('DOMContentLoaded',loadExpense);

function loadExpense(){
    const storedExpenses = JSON.parse(localStorage.getItem('expensesDetails'));

    if(storedExpenses){
        expensesDetails = storedExpenses;
    }
    expenseList(expensesDetails);
    totalExpanceAmt();
    showCharts();

}


function expenseList(expenses){
   
    expance__list.innerHTML = '';

    expenses.forEach((expense) => {

        const li = document.createElement('li');
        li.classList.add('expance__list__item');
        li.setAttribute('data-id', expense.id);
        li.innerHTML = `
            <input type="date" value="${expense.date}" class="expense-item__input" readonly />
            <input type="text" value="${expense.description}" class="expense-item__input" readonly />
            <input type="number" value="${expense.amount}" class="expense-item__input" readonly />
                                 <select class="expense-item__select" id="select_items" disabled>
                <option value="Food" ${expense.category === "Food" ? "selected" : ""}>Food</option>
                <option value="Travel" ${expense.category === "Travel" ? "selected" : ""}>Travel</option>
                <option value="Shopping" ${expense.category === "Shopping" ? "selected" : ""}>Shopping</option>
                <option value="Health" ${expense.category === "Health" ? "selected" : ""}>Health</option>
                <option value="other" ${expense.category === "other" ? "selected" : ""}>other</option>
            </select>
            <div class="action-buttons">
                 <button onclick="editExpenseFunc(${expense.id})"> <i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteExpenseFunc(${expense.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        expance__list.appendChild(li);
    });

}

function  totalExpanceAmt(){
    const total = expensesDetails.reduce((acc, curr) => acc + Number(curr.amount), 0);
    totalamt.innerHTML = total;
}


function groupByCategory() {
    return expensesDetails.reduce((acc, curr) => {
        acc[curr.category] = acc[curr.category] || 0;
        acc[curr.category] = acc[curr.category] + Number(curr.amount);
        return acc;
    }, {});
}

function groupByMonth() {
    return expensesDetails.reduce((acc,curr) => {
        const month = new Date(curr.date).toLocaleString('default', { month: 'long' });
        acc[month] = acc[month] || 0;
        acc[month] = acc[month] + Number(curr.amount);
        return acc;
    }, {});
}

function showCharts() {
    const categoryData =  groupByCategory();
    const monthData = groupByMonth();

    const categoryChartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: [  "#b91d47",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145"],
        }]
    };


    if (CategoryChart) {
        CategoryChart.data = categoryChartData;
        CategoryChart.update();
    } else {
        CategoryChart = new Chart( expanceCategoryChart, {
            type: 'pie',
            data: categoryChartData,
            options:{
                  title:{
                       display:true,
                       text:'Expance by Category',
                       font: {
                        size: 20
                    }

                  }
            }
        });
    }

    const monthChartData = {
        labels: Object.keys(monthData), 
        datasets: [{
            label: 'Expenses by Month',
            data: Object.values(monthData),
            borderColor: '#FF5722',
            borderWidth: 2, 
            fill: false, 
        }]
    };
    
    const Options = {
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    if (MonthChart) {
        MonthChart.data = monthChartData;
        MonthChart.update();
    } else {
        MonthChart = new Chart(expanceMonthChart, {
            type: 'line', 
            data: monthChartData,
            options: Options 
        });
    }

}



function addAnExpance(expance){

    expance.id = Date.now();
    expensesDetails.push(expance);
    localStorage.setItem('expensesDetails',JSON.stringify(expensesDetails));
    expenseList(expensesDetails);
    totalExpanceAmt();
    showCharts();

}

function deleteExpenseFunc(id) {

    if (confirm("Are you sure you want to delete this Expance?")) {
        expensesDetails = expensesDetails.filter(expense => expense.id !== id);
        localStorage.setItem('expensesDetails',JSON.stringify(expensesDetails));
        expenseList(expensesDetails);
        totalExpanceAmt();
        showCharts();
    }
}

function editExpenseFunc(id) {
    
    const li = document.querySelector(`li[data-id="${id}"]`);
    const inputs = li.querySelectorAll('input');
    const select = li.querySelector('select');

    inputs.forEach(input=>{
        input.removeAttribute('readonly');
    })

    select.removeAttribute('disabled');

    li.querySelector('.action-buttons').innerHTML = `
       <button onclick="saveFunc(${id})"><i class="fa-solid fa-check"></i></button>
        <button onclick="cancel()"><i class="fa-solid fa-xmark"></i></button>
    `;

}


function saveFunc(id) {
    const expense = expensesDetails.find(exp => exp.id === id);

       
    const li = document.querySelector(`li[data-id="${id}"]`);
    const inputs = li.querySelectorAll('input');
    const select = li.querySelector('select');


    if(inputs[1].value > 40){
        alert(" Description text must be 40 characters or less ")
        return;
    }

    if (Number(inputs[2].value) <= 0 || Number(inputs[2].value) === '' || isNaN(Number(inputs[2].value))) {
        alert("Amount should be greater than zero and a positive number.");
        return;
      }
    
      if (inputs[1].value === 0 || !/^[a-zA-Z][A-Za-z0-9!()_\-\.\s]+$/.test(inputs[1].value)) {
        alert("invaild desc");
        return;
      }
   
    expense.date = inputs[0].value;
    expense.description = inputs[1].value;
    expense.amount = Number(inputs[2].value);
    expense.category = select.value;


    localStorage.setItem('expensesDetails',JSON.stringify(expensesDetails));
    expenseList(expensesDetails);
    totalExpanceAmt();
    showCharts();
    
    alert("edited sucessfully")
    

}
function cancel(){
    expenseList(expensesDetails)
}


function ClearErrorMessage(){
    document.getElementById("error1").style.display = "none";
    document.getElementById("message1").style.display = "none";
    document.getElementById("message2").style.display = "none";
    document.getElementById("error2").style.display = "none";
    document.getElementById("error3").style.display = "none";
  }

function formVaildation(){
     
    let isVaild = true;
    ClearErrorMessage();

    inputs.forEach(input=>{
        const value = input.value.trim();

        if (input.name === "description") {
            if (value.length === 0) {
    
              document.getElementById("error1").style.display = "flex";
              isVaild = false;
       
            } else if (!/^[a-zA-Z][A-Za-z0-9!()_\-\.\s]+$/.test(value)) {
               
              document.getElementById("message1").style.display = "flex";
              isVaild = false;
            }
      
          }
        
          if(input.name === "amount"){
              
            if(value.length === 0){
                document.getElementById("error2").style.display = "flex";
                isVaild = false;
            }
            else if (value < 0){
                document.getElementById("message2").style.display = "flex";
                isVaild = false;
            }

          }

          if(input.name === "date"){
             
            if(value.length === 0){
                document.getElementById("error3").style.display = "flex";
                isVaild = false;
            }
          }


    });

    return isVaild;


}

submit_form.addEventListener('click',(e)=>{
   
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;


    if(!formVaildation())  return; 

    if(description.length > 40){
        alert(" Description text must be 40 characters or less ")
        return;
    }

     alert("Expance added Sucessfully ");

    if(description && amount && date && category){

        const newExpense = {date,description,amount:Number(amount),category}
        addAnExpance(newExpense);
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
        document.getElementById('category').value = '';

    }
});


search_btn.addEventListener('click' ,(e)=>{
    
    const query = SearchInput.value.trim();
    if(query.length === 0){
        alert("enter the category");
        return;
    }
   const filterExpenses = expensesDetails.filter(expense => expense.category.toLowerCase() === query.toLowerCase());
        
        if(filterExpenses.length === 0){
           alert("no category found");
           
        }
        else{
            expenseList(filterExpenses);
        }
  
})

addExpancebtn.addEventListener('click',()=>{

    popup.style.display = 'flex';
});

closeBtn.addEventListener('click',()=>{
    popup.style.display = 'none';
    ClearErrorMessage();
});
