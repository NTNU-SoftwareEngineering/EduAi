student_nav = '<aside id="sidebar" >\
    <ul class="sidebar-nav">\
      <li class="sidebar-item">\
        <a href="#">\
          <img class="sidebar-logo-img" src="assets/images/logo.svg" alt="logo">\
        </a>\
      </li>\
        <li class="sidebar-item">\
            <a href="#" class="sidebar-link no-hover">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\
                <circle cx="12" cy="8" r="3.5" stroke="#363636" stroke-linecap="round"/>\
                <path d="M4.84913 16.9479C5.48883 14.6034 7.91473 13.5 10.345 13.5H13.655C16.0853 13.5 18.5112 14.6034 19.1509 16.9479C19.282 17.4287 19.3868 17.9489 19.4462 18.5015C19.5052 19.0507 19.0523 19.5 18.5 19.5H5.5C4.94772 19.5 4.49482 19.0507 4.55382 18.5015C4.6132 17.9489 4.71796 17.4287 4.84913 16.9479Z" stroke="#363636" stroke-linecap="round"/>\
              </svg>\
                <span class="current-user"></span>\
            </a>\
        </li>\
        <li class="sidebar-item">\
        <a href="./student_user_data_edu.html" class="sidebar-link">\
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\
            <circle cx="12" cy="8" r="3.5" stroke="#363636" stroke-linecap="round"/>\
            <path d="M4.84913 16.9479C5.48883 14.6034 7.91473 13.5 10.345 13.5H13.655C16.0853 13.5 18.5112 14.6034 19.1509 16.9479C19.282 17.4287 19.3868 17.9489 19.4462 18.5015C19.5052 19.0507 19.0523 19.5 18.5 19.5H5.5C4.94772 19.5 4.49482 19.0507 4.55382 18.5015C4.6132 17.9489 4.71796 17.4287 4.84913 16.9479Z" stroke="#363636" stroke-linecap="round"/>\
          </svg>\
            <span>會員資料</span>\
        </a>\
    </li>\
        <li class="sidebar-item">\
          <a href="student_discussion.html" class="sidebar-link">\
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\
              <path d="M4 12C4 7.58172 7.58172 4 12 4V4C16.4183 4 20 7.58172 20 12V17.0909C20 17.9375 20 18.3608 19.8739 18.6989C19.6712 19.2425 19.2425 19.6712 18.6989 19.8739C18.3608 20 17.9375 20 17.0909 20H12C7.58172 20 4 16.4183 4 12V12Z" stroke="#363636"/>\
              <path d="M9 11L15 11" stroke="#363636" stroke-linecap="round" stroke-linejoin="round"/>\
              <path d="M12 15H15" stroke="#363636" stroke-linecap="round" stroke-linejoin="round"/>\
            </svg>\
              <span>分組討論頁面</span>\
          </a>\
        </li>\
        <li class="sidebar-item">\
          <a href="student_conversation.html" class="sidebar-link">\
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\
              <path d="M20 11.9999C20 8.2287 20 6.34308 18.8284 5.17151C17.6569 3.99994 15.7712 3.99994 12 3.99994V3.99994C8.22876 3.99994 6.34315 3.99994 5.17157 5.17151C4 6.34308 4 8.2287 4 11.9999V17.9999C4 18.9427 4 19.4142 4.29289 19.707C4.58579 19.9999 5.05719 19.9999 6 19.9999H12C15.7712 19.9999 17.6569 19.9999 18.8284 18.8284C20 17.6568 20 15.7712 20 11.9999V11.9999Z" stroke="#363636"/>\
              <path d="M9 9.99994L15 9.99994" stroke="#363636" stroke-linecap="round" stroke-linejoin="round"/>\
              <path d="M9 13.9999H12" stroke="#363636" stroke-linecap="round" stroke-linejoin="round"/>\
            </svg>\
              <span>即時聊天</span> \
          </a>\
        </li>\
        <li class="sidebar-item">\
            <a href="stufb_understand_edu.html" class="sidebar-link">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\
                <path d="M20 12V17C20 18.8856 20 19.8284 19.4142 20.4142C18.8284 21 17.8856 21 16 21H6.5C5.11929 21 4 19.8807 4 18.5V18.5C4 17.1193 5.11929 16 6.5 16H16C17.8856 16 18.8284 16 19.4142 15.4142C20 14.8284 20 13.8856 20 12V7C20 5.11438 20 4.17157 19.4142 3.58579C18.8284 3 17.8856 3 16 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V18.5" stroke="#363636"/>\
                <path d="M9 8L15 8" stroke="#363636" stroke-linecap="round"/>\
              </svg>\
                <span>學生課後回饋</span>\
            </a>\
        </li>\
    </ul>\
    <div class="sidebar-footer">\
        <a href="#" class="sidebar-link" onclick="logout()">\
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\
            <path d="M8 18.9282C9.21615 19.6303 10.5957 20 12 20C13.4043 20 14.7838 19.6303 16 18.9282C17.2162 18.2261 18.2261 17.2162 18.9282 16C19.6303 14.7838 20 13.4043 20 12C20 10.5957 19.6303 9.21615 18.9282 8C18.2261 6.78385 17.2162 5.77394 16 5.0718C14.7838 4.36965 13.4043 4 12 4C10.5957 4 9.21615 4.36965 8 5.0718" stroke="#363636"/>\
            <path d="M2 12L1.60957 11.6877L1.35969 12L1.60957 12.3123L2 12ZM11 12.5C11.2761 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.2761 11.5 11 11.5V12.5ZM5.60957 6.68765L1.60957 11.6877L2.39043 12.3123L6.39043 7.31235L5.60957 6.68765ZM1.60957 12.3123L5.60957 17.3123L6.39043 16.6877L2.39043 11.6877L1.60957 12.3123ZM2 12.5H11V11.5H2V12.5Z" fill="#363636"/>\
          </svg>\
            <span>登出</span>\
        </a>\
    </div>\
</aside>';

document.write(student_nav);