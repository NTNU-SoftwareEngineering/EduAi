setInterval(() => {
    if (document.querySelector("#sidebar:hover")) {
        document.querySelector("#sidebar").classList.add("expand");
    }
    else {
        document.querySelector("#sidebar").classList.remove("expand");
    }
}, 10);

document.addEventListener("DOMContentLoaded", async () => {
    const current_user = document.querySelector(".current-user");

    try {
        const user_id  = await get_userid();
        const username = await get_user_fullname_by_id(user_id);

        const courses = await fetchCourses();
        const course_id = courses[0].id;

        let role = await get_role_from_course(course_id, user_id)
        .then((role) => {
            if (role == 5) {
                return "同學";
            }
            else {
                return "老師";
            }
        });

        current_user.textContent = `${username} ${role}，您好`;
    }
    catch (error) {
        console.error(error);
        current_user.textContent = "您好";
    }
});
