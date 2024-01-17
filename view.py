<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ lugar }} - Visualização</title>
</head>
<body>
    <h1>{{ lugar }} - Visualização</h1>
    <img id="img" src="{{ url_for('video_feed', camera_id=camera_id) }}" width="640" height="480">
    <script>
        setInterval(function() {
            var img = document.getElementById("img");
            img.src = "{{ url_for('video_feed', camera_id=camera_id) }}"
        }, 1000);
    </script>
    <p><a href="{{ url_for('index') }}">Voltar para a página inicial</a></p>
</body>
</html>
