const TodoList = artifacts.require('./TodoList.sol') // 컨트랙트 사용


contract('TodoList', (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed()
  }) // 테스트 실행 전 정의

  // 테스트 실행
  it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists tasks', async () => {
    const taskCount = await this.todoList.taskCount() // BigNumber로 리턴
    const task = await this.todoList.tasks(taskCount)
    assert.equal(task.id.toNumber(), taskCount.toNumber())
    assert.equal(task.content, 'Check out Test')
    assert.equal(task.completed, false)
    assert.equal(taskCount.toNumber(), 1)
  })
})