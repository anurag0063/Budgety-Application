//Budget Controler
var BudgetControler = (function () {
    // Construct a constructor for creating an Expense and an Income,
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    Expense.prototype.calcPercentages = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
        
    }
     
    Expense.prototype.getPercentages = function() {
        return this.percentage;
    }
    // create an Object to strore all your expenses and incomes and also to calculate their total.
    
    var data = {
        // object for storing all the expense/income in an array
        allItems: {
            //property for expense an income
            exp: [],
            inc: []
        }, 
        //object for storing total of expense and income
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = function (type) {
        var sum  = 0 ;
         data.allItems[type].forEach(function (curr) {                
                sum += curr.value;
            })
        data.total[type] = sum;
     };
    
    
    return {
                                     
                                     
        // Create a function for other methods to interact to this function and create a expense/income
        createItem: function (type, description, value) {
            var addItem, id;
            if (data.allItems[type].length > 0) {
                // to create the id lastItem in the array + 1
                // console.log(data.allItems[type][data.allItems[type].length - 1]);
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            //console.log(type);
            if (type === 'exp') {
            addItem = new Expense(id, description, value);
            } else if (type === 'inc') {
                addItem = new Income(id, description, value);        
    ``            } 
``            
            // adding expense/income to the array
            data.allItems[type].push(addItem);
            return addItem;  
            
        }, 
        
            deleteItem: function(type, ido) {
                var ids, index;
               // console.log('id that was sent: ' + ido);
               
                //to create a whole new array with the index in it
                ids = data.allItems[type].map(function(current) {                   
                   return current.id; 
                    
                });
                 console.log('ids: ' + ids);
                if(index !== -1) {
                    
                    // to find the index of the id in the ids array
                    index = ids.indexOf(ido);
                }  
                //console.log(ido);
               // console.log('index: ' + index); 
                
                //to delete the the value at that index
                //splice is used to delete the value in an array the first parameter is for the position and the second one is for how many values you want to delete
                
                data.allItems[type].splice(index, 1);
            },
            
            calculateBudget : function() {
            
                //Calculate Total
                calculateTotal('inc');
                calculateTotal('exp');
            
                //Calculate Budget
                data.budget = data.total.inc - data.total.exp;
                
                //Calculate Percentage
                if(data.total.inc > 0) {
                    data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
                } else {
                    data.percentage = -1;
                }
        }, 
        
            calculatePercentages: function () {
                data.allItems.exp.forEach(function(cur) {
                    cur.calcPercentages(data.total.inc);
                }); 
            }, 
        
            getPercentages: function () {
                var newArr = data.allItems.exp.map(function (curr) {
                    return curr.getPercentages();
                });
                return newArr;
            },
            
            returnBudget : function () {
            return {
                totalExp: data.total.exp,
                totalInc: data.total.inc,
                budget: data.budget,
                percentage: data.percentage
            };
        }, 
            
            testing: function () {
            console.log(data);
      }                  
    };
    
    
    
})();


//UI controler
var UIControler = (function () {
    var html, newHtml, element;
    
    var domStrings = {
        domType: '.add__type',
        domDescrip: '.add__description',
        domValue: '.add__value',
        domButton: '.add__btn',
        income: '.income__list',
        expenses: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type) {
        var int, splitId, dec, sign;
        num = Math.abs(num);
        
        //for two decimal points after decimal
        num = num.toFixed(2);
        
        //to split the number into two parts; integer and decimal
        splitId = num.split('.');
        
        //store the integer part in the int variable and decimal in dec
        int = splitId[0];
        dec = splitId[1];
        
        //to put , at the right spot 12,345
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, 3);
        }
        
        
        type === 'exp' ? sign = '-' : sign = '+';
        return sign + ' ' + int + '.' + dec;
        
    }
        
        
        
    return {
         publicFunction:  function () {  
            return {
               type: document.querySelector(domStrings.domType).value,//either inc or exp
               description: document.querySelector(domStrings.domDescrip).value,
               value: parseFloat(document.querySelector(domStrings.domValue).value)
            };
        }, 
        
        clearFields: function () {
            var fields, fieldsArray;
            // the following will store the value in the fields list
            fields = document.querySelectorAll(domStrings.domDescrip + ',' + domStrings.domValue);
            
            //converting the list into an array
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function (current, index, array) {
                // to empty all the fields
                current.value = "";
                //
            });
            
            fieldsArray[0].focus();
        }, 
        
        removeElement: function(selectorId) {
            var el;
            //in java script you can not delete the element you can only delete the child node so there is a trick here,  
            
            //first select the element you want to delete
            el =  document.getElementById(selectorId);
            
            //then go to its parent node and then pass the element itself inside the remove child
            el.parentNode.removeChild(el);
            
        }, 
        
        DisplayUI : function(obj) {
            var type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp'
            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            if(obj.percentage > 0) {                
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(domStrings.percentageLabel).textContent = "---";
            }
        },
        
        displayPercentage: function(percentage) {
            var fields;
            fields = document.querySelectorAll(domStrings.expensePercLabel);
            
            // create a function to use all the selected list and change the text content  to display the calculated percentage
            var nodeForEach = function (list, callBack) {
                for(var i = 0; i < list.length; i++) {
                    callBack(list[i], i);
                }
                
            }
            
            //calling a function and passing the list and the function as an argument
            nodeForEach(fields, function (curr, index) {
                if(percentage[index] > 0) {
                    curr.textContent = percentage[index] + '%';
                } else {
                    curr.textContent = '---';
                }
                
            });
        },
        
        displayMonth: function () {
            var year, date, month, monthNames;
            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(domStrings.dateLabel).textContent = monthNames[month] + ' ' + year;
        },
        
        changeColor: function () {
            var fields;
           fields = document.querySelectorAll(
                domStrings.domType + ',' + domStrings.domDescrip + ',' + domStrings.domValue            
            );
            var convertTolist = function (list, callBack) {
                for(var i = 0; i < list.length; i++) {
                    callBack(list[i])
                }
            }
            convertTolist(fields, function(element) {
               element.classList.toggle('red-focus'); 
            });
            document.querySelector(domStrings.domButton).classList.toggle('red');
        },
        
        DomData: function () {
            return domStrings;
        }, 
        // to add html to the page.
        addHtml: function (obj, type) {
            if(type === 'inc') {
                element = domStrings.income;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = domStrings.expenses;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // replace the placeholder with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // add html to the dom
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }
        
    }
    
})();


//Global app controler
var Controler = (function (budgetCtrl, uiCtrl) {
    var dom, item;
    
    
    var eventListenerFunction = function () {
        dom = uiCtrl.DomData();        
        document.querySelector(dom.domButton).addEventListener('click', ctrlAddItem);    
        document.addEventListener('keypress', function (event) {

            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
        
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(dom.domType).addEventListener('change', uiCtrl.changeColor);
        console.log('Application has started!');
    }
    
    var updateBudget = function () {
        
        // Calculate the budget
        
        budgetCtrl.calculateBudget();
        
        // return the budget
        
        var budget = budgetCtrl.returnBudget();
        //console.log(budget);
        
        uiCtrl.DisplayUI(budget);
        // Display the budget on the UI
        
    }
    
    
    var updatePercentage = function () {
        //calculate the percentage
        budgetCtrl.calculatePercentages();
        
        //read the percentage from the budget controller
       var perc =  budgetCtrl.getPercentages();
        // update the UI with the new percentage
        
        uiCtrl.displayPercentage(perc);
    }
    
    var ctrlAddItem = function () {        
        
//      1. Get the field input data.        
            var addItem = uiCtrl.publicFunction();
        var desc = addItem.description;
       // console.log(desc);
        
        if(addItem.description != "" && !isNaN(addItem.value) && addItem.value > 0) {
           
//      2. Add the item to the budget controller.       
            item = budgetCtrl.createItem(addItem.type, addItem.description, addItem.value);
        
//      3. Add the item to the UI.        
            uiCtrl.addHtml(item, addItem.type);
//        
//      4. Clear the fields
            uiCtrl.clearFields();
            
            
        //update the budget
            updateBudget();
            
        //calculate update the percentage
            updatePercentage();
            
           }      
    }
    
    var ctrlDeleteItem = function (event) {
        var splitId, itemId, id, type;
        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitId = itemId.split('-');
        id = parseInt(splitId[1]);
        type = splitId[0];
        console.log(splitId);
        
        //delete item from the data structure
        budgetCtrl.deleteItem(type, id);
        
        //delete the item from the UI
        uiCtrl.removeElement(itemId);
        
        //update the budget
        updateBudget();
        
        // calculate update the percentage
    }
    
    return {
        init: function () {
            uiCtrl.displayMonth();
             uiCtrl.DisplayUI({
                 totalExp: 0,
                 totalInc: 0,
                 budget: 0,
                 percentage: 0});
            return eventListenerFunction();
        }
    }
})(BudgetControler, UIControler);

Controler.init();





    






