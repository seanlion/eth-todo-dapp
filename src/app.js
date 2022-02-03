App = {
    loading: false,
    contracts: {},
    load: async () => {
        // load app.
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        console.log("app loading..");
    },
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
          }
        if (window.ethereum) {
            await window.ethereum.request({method: 'eth_requestAccounts'});
            window.web3 = new Web3(window.ethereum);
            console.log("Metamask request succeed");
            return true;
        }
        return false;
    },    
    loadAccount: async () => {
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0] // accounts의 1번째
    },
    loadContract: async() => {
        const todoList = await $.getJSON('TodoList.json') // artifact 가져옴.
        App.contracts.TodoList = TruffleContract(todoList) // 컨트랙트 생성해줌.
        App.contracts.TodoList.setProvider(ethereum)
        App.todoList = await App.contracts.TodoList.deployed()
    },

    render: async() => {
        if (App.loading){
            return
        }
        App.setLoading(true)
        $('#account').html(App.account)
        await App.renderTasks()
        App.setLoading(false)
    },

    renderTasks: async () => {
        const taskCount = await App.todoList.taskCount()
        console.log("taskCount:", taskCount)
        const $taskTemplate = $('.taskTemplate')

        for (var i=1; i <= taskCount.toNumber(); i++){
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            //.on('click', App.toggleCompleted)
            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
            $newTaskTemplate.show()
        }
    },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content, {from: App.account})
        window.location.reload()
      },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})
