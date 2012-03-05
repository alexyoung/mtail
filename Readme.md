## mtail

Tail multiple files.

### Usage

    Usage: mtail [options] <file ...>

    Options:

      -h, --help                 output usage information
      -V, --version              output the version number
      -e, --encoding [encoding]  File encoding [utf8]
      -f, --follow               Keep watching the file for changes
      -n [lines]                 Start location in number of lines [10]
      -s, --sleep-interval       Sleep interval in milliseconds [100]
      -p, --print-file           Print the name of each file
      -t, --truncate [length]    Truncate filenames when printed with -p, defaults to truncating to basename

### Installation

    npm install mtail

### License

(The MIT License)

Copyright (C) 2012, Alex R. Young

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
