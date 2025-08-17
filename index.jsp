<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>index</title>
</head>

<script src="assets/yi/yi.js"></script>
<script>
  function setup() {
    const container = document.querySelector('.img-container');
    getYi().forEach(obj => {
      container.innerHTML += create(obj);
    });
  }
</script>

<link rel="stylesheet" type="text/css" href="assets/yi/yi.css">

<body onload="setup()">
  <div class="img-container">
  </div>
</body>

</html>