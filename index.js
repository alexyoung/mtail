var fs = require('fs')
  , tty = require('tty')
  , isatty = tty.isatty(1) && tty.isatty(2)
  , path = require('path')
  , colours = [90, 31, 92, 91, 93, 36, 31, 32, 42, 41]
  , bufferSize = 4096
  , fileCount = 0;

function colour(index, str) {
  if (!isatty) return str;
  index = index % (colours.length - 1);
  return '\033[' + colours[index] + 'm' + str + '\033[0m';
}

function handleOptions() {
  var program = require('commander');

  program
    .version(JSON.parse(fs.readFileSync(__dirname + '/package.json')).version)
    .option('-e, --encoding [encoding]', 'File encoding [utf8]', 'utf8')
    .option('-f, --follow', 'Keep watching the file for changes')
    .option('-n [lines]', 'Start location in number of lines [10]', parseInt)
    .option('-s, --sleep-interval', 'Sleep interval in milliseconds [100]', parseInt)
    .option('-p, --print-file', 'Print the name of each file')
    .option('-t, --truncate [length]', 'Truncate filenames when printed with -p, defaults to truncating to basename', parseInt)
    .usage('[options] <file ...>')
    .parse(process.argv);

  if (program.args) {
    program.args.forEach(function(file) {
      tailFile(file, program);
    });
  }
}

function truncate(file, length) {
  return length === true ? path.basename(file) : file.slice(file.length - length);
}

function tailFile(file, options) {
  var fileText = options.truncate ? colour(fileCount, truncate(file, options.truncate)) + ': ' : colour(fileCount, file) + ': '
    , charsWritten = 0
    , output = new Buffer(bufferSize); // TODO: Buffer size?

  fileCount++;

  function clear() {
    output.fill(0);
    charsWritten = 0;
  }

  function print(buffer) {
    options.printFile ? printFile(buffer.toString()) : process.stdout.write(buffer);
  }

  function showLinesWithLength(fd, n, length, fn) {
    var text = '';
    if (length === 0) return fn();

    function end() {
      var l = text.length, reversed = '', i;
      for (i = l - 2; i >= 0; i--) {
        reversed += text[i];
      }
      clear();
      print(reversed);
      fn();
    }

    function read(p) {
      fs.read(fd, new Buffer(1, options.encoding), 0, 1, p, function(err, bytes, buffer) {
        var c = buffer.toString();

        if (c === '\n') n--;
        text += c;

        if (n === 0) {
          end();
        } else {
          p < 1 ? end() : read(p - 1);
        }
      });
    }

    read(length - 1);
  }

  function showLines(fd, n, fn) {
    fs.stat(file, function(err, stat) {
      showLinesWithLength(fd, n + 1, stat.size, fn);
    });
  }

  function printFile(text) {
    var i = text.indexOf('\n');

    if (i >= 0) {
      output.write(text.substr(0, i), charsWritten);
      charsWritten += i;
      process.stdout.write(fileText + output.toString(options.encoding, 0, charsWritten) + '\n');
      clear();

      // Recursively print until the newlines have all been found
      if (i < text.length - 1) {
        return printFile(text.substr(i + 1));
      }
    } else {
      output.write(text, charsWritten);
      charsWritten += text.length;

      // If the buffer gets to the end, print it and clear it
      if (charsWritten >= bufferSize) {
        process.stdout.write(fileText + output.toString(options.encoding, 0, charsWritten) + '\n');
        clear();
      }
    }
  }

  fs.open(file, 'r', function(err, fd) {
    var lastStat = fs.statSync(file);

    if (err) {
      console.error('Error opening file:', file);
      console.error(err);
      return;
    }

    function watch() {
      if (!options.follow) return;

      fs.watch(file, { interval: options.sleepInterval || 100 }, function(event) {
        if (event === 'change') {
          fs.stat(file, function(err, stat) {
            var delta = stat.size - lastStat.size
              , start = lastStat.size;

            if (delta <= 0) {
              delta = stat.size;
              start = 0;
            }

            lastStat = stat;

            if (stat.size === 0) return;

            fs.read(fd, new Buffer(delta, options.encoding), 0, delta, start, function(err, bytes, buffer) {
              if (err) {
                // TODO: Clean exit
                console.error('Error reading file:', file);
                console.error(err);
                process.exit(1);
              }

              print(buffer);
            });
          });
        }
      });
    }

    options.N = typeof(options.N) === 'undefined' ? 10 : options.N;

    if (options.N) {
      showLines(fd, options.N, watch);
    } else {
      watch();
    }
  });
}

module.exports.handleOptions = handleOptions;
module.exports.tailFile = tailFile;
module.exports.util = {
  colour: colour
, truncate: truncate
};
