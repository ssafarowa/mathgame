$(document).ready(function () {
	var btn = $("#add-button")[0];
	var saveTasks = function () {
		$.ajax({
			type: "GET",
			url: "https://fewd-todolist-api.onrender.com/tasks?api_key=1108",
			dataType: "json",
			success: function (response, textStatus) {
				$("#toappend").empty();
				response.tasks.forEach(function (task) {
					var completedClass = task.completed ? "striked" : "";
					$("#toappend").append(
						"<div class='todo " +
							completedClass +
							"'>" +
							"<p>" +
							task.content +
							"</p>" +
							"<div>" +
							"<button class='remove' data-id='" +
							task.id +
							"'>" +
							"Delete" +
							"</button>" +
							"<button class='actv' data-id='" +
							task.id +
							"'>" +
							"Active" +
							"</button>" +
							"<button class='new-button' data-id='" +
							task.id +
							"'>" +
							"Done" +
							"</button>" +
							"</div>" +
							"</div>"
					);
				});
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	};
	saveTasks();

	btn.addEventListener("click", function () {
		var inputVal = $("input").val();
		$.ajax({
			type: "POST",
			url: "https://fewd-todolist-api.onrender.com/tasks?api_key=1108",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({
				task: {
					content: inputVal,
				},
			}),
			success: function (response, textStatus) {
				$("#toappend").append(
					"<div class='todo'>" +
						"<p>" +
						response.task.content +
						"</p>" +
						"<div>" +
						"<button class='remove' data-id='" +
						response.task.id +
						"'>" +
						"Delete" +
						"</button>" +
						"<button class='actv' data-id='" +
						response.task.id +
						"'>" +
						"Active" +
						"</button>" +
						"<button class='new-button' data-id='" +
						response.task.id +
						"'>" +
						"Done" +
						"</button>" +
						"</div>" +
						"</div>"
				);
				inputVal = $("input").val("");
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	});

	var deleteTask = function (taskId) {
		$.ajax({
			type: "DELETE",
			url:
				"https://fewd-todolist-api.onrender.com/tasks/" +
				taskId +
				"?api_key=1108",
			success: function (response, textStatus) {
				console.log(response);
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	$(document).on("click", ".remove", function () {
		var taskId = $(this).data("id");
		deleteTask(taskId);
		$(this).closest(".todo").remove();
	});

	var markCompleted = function (id) {
		$.ajax({
			type: "PUT",
			url:
				"https://fewd-todolist-api.onrender.com/tasks/" +
				id +
				"/mark_complete?api_key=1108",
			dataType: "json",
			success: function (response, textStatus) {
				$("#toappend")
					.find("[data-id='" + id + "']")
					.closest("p")
					.addClass("completed");
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	};
	var markActive = function (id) {
		$.ajax({
			type: "PUT",
			url:
				"https://fewd-todolist-api.onrender.com/tasks/" +
				id +
				"/mark_active?api_key=1108",
			dataType: "json",
			success: function (response, textStatus) {
				$("#toappend")
					.find("[data-id='" + id + "']")
					.closest(".todo")
					.removeClass("striked");
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	$("#toappend").on("click", ".new-button", function () {
		$(this).closest(".todo").find("p").addClass("striked");
		markCompleted($(this).data("id"));
	});

	$("#toappend").on("click", ".actv", function () {
		$(this).closest(".todo").find("p").removeClass("striked");
		markActive($(this).data("id"));
	});

	var getTaskStatus = function () {
		$.ajax({
			type: "GET",
			url: "https://fewd-todolist-api.onrender.com/tasks?api_key=1108",
			dataType: "json",
			success: function (response, textStatus) {
				$("#toappend").empty();
				response.tasks.forEach(function (task) {
					if (task.completed === false) {
						$("#toappend").append(
							"<div class='todo '>" +
								"<p>" +
								task.content +
								"</p>" +
								"<div>" +
								"<button class='remove' data-id='" +
								task.id +
								"'>" +
								"Delete" +
								"</button>" +
								"<button class='actv' data-id='" +
								task.id +
								"'>" +
								"Active" +
								"</button>" +
								"<button class='new-button' data-id='" +
								task.id +
								"'>" +
								"Done" +
								"</button>" +
								"</div>" +
								"</div>"
						);
					}
				});
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	var updateTaskStatus = function () {
		$.ajax({
			type: "GET",
			url: "https://fewd-todolist-api.onrender.com/tasks?api_key=1108",
			dataType: "json",
			success: function (response, textStatus) {
				response.tasks.forEach(function (task) {
					var $taskElement = $("#toappend")
						.find("[data-id='" + task.id + "']")
						.closest(".todo");

					if (task.completed) {
						$taskElement.find("p").addClass("striked");
					} else {
						$taskElement.find("p").removeClass("striked");
					}
				});
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			},
		});
	};
	updateTaskStatus();

	$(document).on("change", ".active", function () {
		if ($(this).is(":checked")) {
			getTaskStatus();
		} else {
			saveTasks();
		}
	});
});
