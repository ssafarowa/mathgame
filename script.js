$(document).ready(function () {
	var btn = $("button")[0];
	var taskNo = 1;
	btn.addEventListener("click", function () {
		var inputVal = $("input").val();
		var newTodo =
			'<div class="todo">' +
			"<p>" +
			taskNo +
			"." +
			inputVal +
			"</p>" +
			"<button>" +
			"Remove" +
			"</button>" +
			"</div>";
		$("#toappend").append(newTodo);
		taskNo = taskNo + 1;
		inputVal = $("input").val("");
	});
});
