MESSAGE_RESET = """
<!DOCTYPE html>
<html>
<body>
    <h2>Сброс пароля для вашей учётной записи SmartBridge.</h2>
    <h4>Ссылка действительна в течение 24 часов!</h4>
    <a href="{0}"> Сбросить пароль </a>
    <h5>Если это не вы инициировали сброс пароля, ничего не делайте.</h5>
</body>
</html>
"""

MESSAGE_NEW_PASSWORD = """
<!DOCTYPE html>
<html>
<body>
<h2>Новый пароль для SmartBridge.</h2>
<h4>Ваш пароль успешно сброшен. Ваш новый пароль: {0}</h4>
</body>
</html>
"""

MESSAGE_NEW_APPS = """
<!DOCTYPE html>
<html lang="ru">
<body>
<h2>Здравствуйте, {receiver}.</h2>
<div class="wrap-flex">
<p>{name} оставил(а) заявку, которая требует вашего согласования.</p>
<a href="{link}">
<button>Перейти к согласованию</button>
</a>
</div>
<i style="font-size:11px;">Это письмо сформировано автоматически, отвечать на него не нужно.<br style="margin-top: 10px;"/> Ваш сервис управления отпусками nka.</i>
</body>
</html>
"""

MESSAGE_UPDATED_APP = """
<!DOCTYPE html>
<html lang="ru">
<body>
<h2>Здравствуйте, {receiver}.</h2>
<div class="wrap-flex">
<p>По одной из ваших заявок на отпуск был обновлён статус согласования.</p>
<a href="{link}">
<button>Перейти к заявкам</button>
</a>
</div>
<i style="font-size:11px;">Это письмо сформировано автоматически, отвечать на него не нужно.<br style="margin-top: 10px;"/> Ваш сервис управления отпусками, nka.</i>
</body>
</html>
"""
