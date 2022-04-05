from app import app

if __name__ == '__main__':
    from config import host, port, debug
    # print(app.url_map)
    app.run(host=host, port=port, debug=debug)
    