var exec = require('child_process').exec
  , spawn = require('child_process').spawn
  , mtail = require(__dirname + '/../index')
  , assert = require('assert');

before(function(done) {
  exec('> ' + __dirname + '/fixtures/log.txt', function(err, stdout, stderr) {
    done();
  });
});

describe('truncate', function() {
  it('should truncate to basename by default', function() {
    assert.equal('index.js', mtail.util.truncate('../test/index.js', true));
  });

  it('should truncate to any length', function() {
    assert.equal('x.js', mtail.util.truncate('../test/index.js', 4));
  });
});


describe('colour', function() {
  it('should colourise text', function() {
    assert.equal('\033[90mtest\033[0m', mtail.util.colour(0, 'test'));
  });
});

describe('tailFile', function() {
  it('should tail a single file', function(done) {
    var child = spawn(__dirname + '/../bin/mtail', ['-fn', 0, '-t', '10', __dirname + '/fixtures/log.txt'])
      , data = '';

    child.stdout.on('data', function(buffer) {
      data += buffer.toString();
    });

    child.on('exit', function() {
      assert.equal('Logged result\n', data);
      done();
    });

    setTimeout(function() {
      exec('echo "Logged result" >> ' + __dirname + '/fixtures/log.txt', function(err, stdout, stderr) {
        if (err) console.error(err);
        setTimeout(function() {
          child.kill('SIGINT');
        }, 110);
      });
    }, 110);
  });

  it('should handle file truncation', function(done) {
    var child = spawn(__dirname + '/../bin/mtail', ['-fn', '0', '-t', '10', __dirname + '/fixtures/log.txt'])
      , data = '';

    child.stdout.on('data', function(buffer) {
      data += buffer.toString();
    });

    child.on('exit', function() {
      assert.equal('Logged result\n', data);
      done();
    });

    setTimeout(function() {
      exec('echo "Logged result" > ' + __dirname + '/fixtures/log.txt', function(err, stdout, stderr) {
        if (err) console.error(err);
        setTimeout(function() {
          child.kill('SIGINT');
        }, 100);
      });
    }, 110);
  });

  it('should handle zero length files', function(done) {
    var child = spawn(__dirname + '/../bin/mtail', ['-fn', '0', '-t', '10', __dirname + '/fixtures/log.txt'])
      , data = '';

    child.on('exit', function() {
      done();
    });

    child.stdout.on('data', function(buffer) {
    });

    child.stderr.on('data', function(buffer) {
      assert.fail(buffer.toString());
    });


    setTimeout(function() {
      exec('echo "test" > ' + __dirname + '/fixtures/log.txt', function(err, stdout, stderr) {
        if (err) console.error(err);
 
        exec('> ' + __dirname + '/fixtures/log.txt', function(err, stdout, stderr) {
          if (err) console.error(err);
          setTimeout(function() {
            child.kill('SIGINT');
          }, 100);
        });
      });
    }, 110);
  });
});
