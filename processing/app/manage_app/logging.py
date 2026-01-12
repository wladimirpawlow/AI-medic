import logging
import os
from concurrent_log_handler import ConcurrentRotatingFileHandler

processes_logger = logging.getLogger("processes_logger")

def configure_logging(app):
    log_level = app.config['LOG_LEVEL']
    log_file = app.config['LOG_FILE']
    log_filemode = app.config['LOG_FILEMODE']
    log_format = app.config['LOG_FORMAT']
    log_max_bytes = app.config['LOG_MAX_BYTES']
    log_backup_count = app.config['LOG_BACKUP_COUNT']


    # ---------
    # Создаем обработчик для записи логов в файл
    if log_filemode == 'a':
        file_handler = ConcurrentRotatingFileHandler(
                                            log_file,
                                            mode='a',  # Всегда в режиме добавления, ротация автоматически создает новые файлы
                                            maxBytes=log_max_bytes,
                                            backupCount=log_backup_count)
        file_handler.setLevel(log_level)
        file_handler.setFormatter(logging.Formatter(log_format))

    elif log_filemode == 'w':
        file_handler = logging.FileHandler(log_file, mode=log_filemode)
        file_handler.setFormatter(logging.Formatter(log_format))
    # ---------

    # if log_filemode == 'w' and os.path.exists(log_file):
    #     os.remove(log_file)
    #
    # file_handler = ConcurrentRotatingFileHandler(
    #     log_file,
    #     mode='a',
    #     maxBytes=log_max_bytes,
    #     backupCount=log_backup_count
    # )
    # file_handler.setFormatter(logging.Formatter(log_format))
    # file_handler.setLevel(log_level)

    # Настройка корневого логгера
    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(file_handler)
    root_logger.setLevel(log_level)

    # Логгер Flask
    app.logger.handlers.clear()
    app.logger.addHandler(file_handler)
    app.logger.setLevel(log_level)
    app.logger.propagate = False

    # Werkzeug
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.handlers.clear()
    werkzeug_logger.addHandler(file_handler)
    werkzeug_logger.setLevel(log_level)
    werkzeug_logger.propagate = False

    # Processes
    processes_logger.handlers.clear()
    processes_logger.addHandler(file_handler)
    processes_logger.setLevel(log_level)
    processes_logger.propagate = False