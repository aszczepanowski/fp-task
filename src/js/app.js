(function() {
  'use strict';

  // Definiujemy parę przydatnych zmiennych
  var preloader = document.querySelector('.preloader');
  var listing = document.querySelector('.post-listing');
  var btn = document.querySelector('.post-listing__load');
  var instructions = document.querySelector('.page-instructions');

  // Funkcja, dzięki której zmienimy format daty JSON z ISO 8601 na mm.dd.yyyy
  function formatDate(jsonDate) {
    var date = new Date(jsonDate);
    return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
  }

  // Funkcja, dzięki której skrócimy otrzymaną zawartość do danej liczby znaków oraz usuniemy wszystkie znaczniki html.
  function contentTeaser(string, limit, separator) {
    if (string.length <= limit) {
      return string;
    } else {
      return string.substr(0, string.lastIndexOf(separator, limit)).replace(/<[^>]+>/gi, '') + '...';
    }
  }

  // Tworzymy nowe zapytanie HTTP
  var ajax = new XMLHttpRequest();

  // Śledzimy proces naszego zapytania
  ajax.onreadystatechange = function() {
    // Sprawdzamy czy nasze zapytanie zwraca nam jakieś dane
    if (ajax.readyState === 4) {
      // Jeśli tak to chowamy preloader
      preloader.classList.remove('preloader--visible');
      // Sprawdzamy czy zapytanie skończyło się sukcesem
      if (ajax.status === 200) {
        instructions.innerHTML = 'Have a nice and interesting reading!';
        var data = JSON.parse(ajax.responseText);
        var output = '';
        for (var i = 0; i < data.length; i++) {
          output += '<article class="post">';
          output += '<header class="post__heading">';
          output += '<h2 class="post__title"><a href="' + data[i].guid.rendered + '" target="_blank">' + data[i].title.rendered + '</a></h2>';
          output += '<div class="post__metadata">' + formatDate(data[i].date) + '</div>';
          output += '</header>';
          output += '<div class="post__content"><p>' + contentTeaser(data[i].content.rendered, 110, ' ') + '</p></div>';
          output += '<footer class="post__readmore"><a class="btn btn--link" href="' + data[i].guid.rendered + '" title="Read more" target="_blank">Read more</a></footer>';
          output += '</article>';
        }
        listing.innerHTML = output;
      } else {
        listing.innerHTML = 'An error occurred during your request. (' + ajax.status + ')';
      }
    }
  };

  // Określamy metodę zapytania oraz stronę, którą chcemy odpytać
  ajax.open('GET', 'https://www.future-processing.pl/blog/wp-json/wp/v2/posts?per_page=10&orderby=date');

  // Rejestrujemy zdarzenie kliknięcia w przycisk
  btn.addEventListener('click', function() {
    // Pokazujemy preloader
    preloader.classList.add('preloader--visible');
    // Wyłączamy przycisk
    this.disabled = true;
    // Wysyłamy zapytania po 3 sekundach
    setTimeout(function() {
      ajax.send();
    }, 3000);
  });

})();
