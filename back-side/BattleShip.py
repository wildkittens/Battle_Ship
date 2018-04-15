from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, close_room, leave_room, emit, rooms
from game_engine import *
from signals import Signals

app = Flask(__name__)

socketio = SocketIO(app)

ROOMS = {}


@app.route('/')
def hello_world():
    return render_template("index.html")


@socketio.on('connect')
def connected_init():
    emit('connected', {'Hello': "there"})


@socketio.on('create')
def create_game(data):
    game_id = len(ROOMS)
    game = Game(game_id, data['name'])
    ROOMS[game_id] = game
    join_room(game_id)

    emit('created', Signals(219, game=game, name=data['name']).__str__())


@socketio.on('join')
def join_game(data):
    game_id = int(data['game_id'])
    try:
        game = ROOMS[game_id]
        answer = game.join_user2(data['name'])

        if answer:
            join_room(game_id)

            emit('joined', Signals(221, game=game).__str__(), room=game_id)
        else:
            some_users_list = []
            for x in game.players:
                some_users_list.append(x.get_name())
            emit('error', Signals(520, game=game).__str__())
    except KeyError:
        emit("error", Signals(519, id=game_id).__str__())


@socketio.on("setup-ships")
def setting_ships_up(data):
    game_id = int(data['game_id'])
    player_id = int(data['user_id'])

    try:
        game = ROOMS[game_id]
        game.ustanovka(user_id=data['user_id'], ships=data['ships'])
        if player_id == 0:
            game.setted_1 = True
        elif player_id == 1:
            game.setted_2 = True
        if game.setted_1 and game.setted_2:
            game.running = True
            socketio.emit("game-started", {
                "game_id": game_id,
                "next_player_id": 0
            }, room=game_id)

    except KeyError:
        emit('error', Signals(519, id=game_id).__str__())


@socketio.on("fire")
def player_fire(data):
    game_id = int(data['game_id'])
    user_id = int(data['user_id'])
    enemy_id = (user_id + 1) % 2
    coord_x = int(data['coord']['x'])
    coord_y = int(data['coord']['y'])
    try:
        game = ROOMS[game_id]

        if game.running and not game.finished:
            hitted, killed, error = game.fire(coord_x, coord_y, user_id)

            if error:
                emit('error', Signals(521, game=game).__str__(), room=game_id)
                game.error = False
            else:
                emit("fired", {
                    'game_id': game_id,
                    'enemy_id': enemy_id,
                    'next_player_id': game.current_player,
                    'is_hit': hitted,
                    'coord': {
                        'x': coord_x,
                        'y': coord_y
                    },
                    'is_ship': killed
                }, room=game_id)

                if game.finished:
                    emit("game-finished", game.statistics(), room=game_id)
        else:
            emit("error", Signals(522, game=game).__str__())
    except KeyError:
        emit('error', Signals(519, id=game_id).__str__())


@socketio.on("disconnect")
def disconnected():
    if len(rooms()) > 1:
        game_id = -1
        for x in rooms():
            try:
                x += 1
                game_id = x-1
            except TypeError:
                pass
        game = ROOMS[game_id]
        if not game.finished:
            socketio.emit("pinger", Signals(245).__str__(), room=game_id)


@socketio.on("ponger")
def stop_game(data):
    alive_user_id = data['user_id']
    game_id = data['game_id']
    game = ROOMS[game_id]
    if not game.finished:
        game.finished = True
        game.winner = alive_user_id
        emit("game-extra-finished", Signals(249, game=game, id=alive_user_id).__str__(), room=game_id)
        leave_room(game_id)
        close_room(game_id)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5010)
