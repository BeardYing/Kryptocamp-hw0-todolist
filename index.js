// TODO: 使用者可以新增待辦事項 - Done
const addNewTodo = () => {
  if($("#todo").val() == '') {
    alert('請輸入待辦事項標題');
    return false;
  }
  appendTodo($("#todo").val().trim(), false);
  $("#todo").val('');
 
  saveCurrentTodo(); // 更新local紀錄
}

// 加入todo item
const appendTodo = (title, iscomplete) => {
  let tmpl = `<li class="`+ (iscomplete===false?'no-completed':'completed') +`">
    <input class="todolist__input" type="checkbox" `+ (iscomplete===false?'':'checked') +` />
    <span>`+title+`</span>
    <a class="delete" href="#">
      <i class="fa fa-x"></i>
    </a>
  </li>`;
  $('.todolist__item').append(tmpl);
}

// 更新已完成項目
const updateCompletedCount = () => {
  const count = $('.todolist__item').find('.completed').length
  $('.todolist__info').find('a').text(count);
}

// TODO: 使用者可以刪除待辦事項 - Done
const deleteTodo = (e) => {
  if(confirm('請問是否移除此一項目？')){
    $(e.target).closest('li').remove();
    updateCompletedCount(); // 更新完成項目數量
    saveCurrentTodo(); // 更新local紀錄
  }
}

// TODO: 清除已完成項目  - Done
const clearCompletedTodo = () => {
  // 找到 completed 的待辦事項，並移除 .completed class
  if(confirm('是否確認移除完成事項？')){
    $(".todolist__table .completed").remove();
    updateCompletedCount(); // 更新完成項目數量
    saveCurrentTodo(); // 更新local紀錄
  }
}


function saveCurrentTodo() {
  let todos = [];
  $(".todolist__item li").each(function(){
    todos.push({"title": $(this).text().trim(), "completed":$(this).hasClass('completed')});
  });
  localStorage.setItem('todo', JSON.stringify(todos));
}


// 監聽
$(() => {

  // 初始化讀取是否紀錄檔案裡面有資料
  let localstorage_todo = localStorage.getItem('todo');
  if(localstorage_todo) {
    todo_dict = JSON.parse(localstorage_todo);
    console.log(todo_dict);
    todo_dict.forEach(function(todo_item){
      appendTodo(todo_item.title, todo_item.completed);
    });
    updateCompletedCount(); // 更新完成項目數量
  }



  // TODO: 每一條代辦事項 delete 監聽 click 事件  - Done
  $('.todolist__item').on('click', '.delete', (e) => deleteTodo(e))

  // 狀態：全部、待完成、已完成
  $('.todolist__tabs li').each(function () {
    $(this).click(function () {
      $(this).siblings().find('a').removeClass('active')
      $(this).find('a').addClass('active')
    })
  })

  // TODO: 使用者可以將待辦事項設定成已完成  - Done
  // 步驟一：監聽每一個 todo list，前面 checkbox 有被點擊時執行 Function
  // $('.todolist__item li').on('click', 'input', (e) => { -- 新的element會無法觸發
  $('.todolist__item').on('click', 'li input', (e) => {
    // 步驟二：每條待辦事項根據條件，加上不同的 class：completed, no-complete
    let $target_li = $(e.target).closest('li');
    if($target_li.hasClass('completed')){
      $target_li.addClass('no-completed').removeClass('completed');
    }else{
      $target_li.removeClass('no-completed').addClass('completed');
    }

    
    updateCompletedCount(); // 步驟三：更新已完成項目的數字
    saveCurrentTodo(); // 更新local紀錄
  })

  // 篩選全部
  $('.todolist__tabs').on('click', '.all', () => {
    $('.todolist__item').children().show('fast');
  })

  // TODO: 篩選待完成 - Done
  $('.todolist__tabs .no-completed').on('click', function(){
    $(".todolist__item .no-completed").show('fast');
    $(".todolist__item .completed").hide('fast');
  });

  // TODO: 篩選已完成 - Done
  $('.todolist__tabs .completed').on('click', function(){
    $(".todolist__item .no-completed").hide('fast');
    $(".todolist__item .completed").show('fast');
  });
})