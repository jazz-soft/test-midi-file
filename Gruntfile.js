const { execSync } = require('child_process');

module.exports = function(grunt) {
  grunt.task.registerTask('midi', 'Generate MIDI files', function() {
    grunt.file.expand('code/*.js').forEach(file => {
      execSync('node ' + file + ' null', {stdio: 'inherit'});
    });
    grunt.file.expand('code2/*.js').forEach(file => {
      execSync('node ' + file + ' null', {stdio: 'inherit'});
    });
  });
  grunt.task.registerTask('list', 'List MIDI files', function() {
    var i, j, a;
    var midis = [];
    var midis2 = [];
    var list = '' + execSync('git ls-files midi');
    list = list.split('\n');
    for (i = 0; i < list.length; i++) {
      a = list[i].split('/');
      if (a.length == 2) midis.push(a[1]);
    }
    function group(s) {
      if (s == 'test-c-major-scale.mid' || s == 'test-empty.mid') return 0;
      if (s.includes('-silence-')) return 0;
      if (s.includes('-all-')) return 1;
      if (s.includes('doggy')) return 1;
      if (s.includes('karaoke')) return 3;
      if (s.includes('non-midi')) return 4;
      if (s.includes('vlq')) return 5;
      if (s.includes('illegal')) return 6;
      if (s.includes('corrupt')) return 6;
      if (s.includes('-file')) return 7;
      if (s.includes('syx')) return 7;
      return 2;
    }
    midis.sort(function(a, b) {
      var aa = group(a);
      var bb = group(b);
      return aa == bb ? a.localeCompare(b) : aa - bb;
    });
    list = '' + execSync('git ls-files midi2');
    list = list.split('\n');
    for (i = 0; i < list.length; i++) {
      a = list[i].split('/');
      if (a.length == 2) midis2.push(a[1]);
    }
    function group2(s) {
      if (s.includes('-file')) return 1;
      return 0;
    }
    midis2.sort(function(a, b) {
      var aa = group2(a);
      var bb = group2(b);
      return aa == bb ? a.localeCompare(b) : aa - bb;
    });
    var rdme = grunt.file.read('README.md').split(/\r?\n/);
    var out = [];
    for (i = 0; i < rdme.length; i++) {
      out.push(rdme[i]);
      if (rdme[i] == '## Test files') break;
    }
    for (; i < rdme.length; i++) if (rdme[i] == '## More to come...') break;
    for (j = 0; j < midis.length; j++) out.push('- [**' + midis[j] + '**](https://github.com/jazz-soft/test-midi-files/raw/main/midi/' + midis[j] + ')');
    for (j = 0; j < midis2.length; j++) out.push('- [**' + midis2[j] + '**](https://github.com/jazz-soft/test-midi-files/raw/main/midi2/' + midis2[j] + ')');
    for (; i < rdme.length; i++) out.push(rdme[i]);
    grunt.file.write('README.md', out.join(require('os').EOL));
  });

  grunt.registerTask('default', ['midi', 'list']);
};
