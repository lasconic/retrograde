//=============================================================================
//  Retrograde plugin
//  http://musescore.org/en/project/retrograde
//
//  Copyright (C)2010 Nicolas Froment (lasconic)
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 2.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//=============================================================================

//---------------------------------------------------------
//    init
//---------------------------------------------------------

function init()
      {
      
      };


function addChord(cursor, duration){
      var chord     = new Chord();
      chord.tickLen = duration;
      cursor.add(chord);
      cursor.next();
      return chord;
}

function addNote(chord, pitch)
      {
      var note      = new Note();
      note.pitch    = pitch;
      chord.addNote(note);
      };

function addRest(cursor, duration){
     var rest = new Rest();
     rest.tickLen = duration;
     cursor.add(rest);
     cursor.next();
}

function run()
      {
      if (typeof curScore === 'undefined')	
            return; 
      var chordArray = [];
      var cursor       = new Cursor(curScore);
      var selectionEnd = new Cursor(curScore);

      cursor.goToSelectionStart();
      selectionEnd.goToSelectionEnd();
      var startStaff = cursor.staff;
      var endStaff   = selectionEnd.staff;

      for (var staff = startStaff; staff < endStaff; ++staff) {
            cursor.goToSelectionStart();
            for (var voice = 0; voice < 1; voice++) {
                  cursor.voice = voice;
                  cursor.goToSelectionStart();
                  cursor.staff = staff;

                  while (cursor.tick() < selectionEnd.tick()) {
                        if (cursor.isChord()) {
                              var chord = cursor.chord();
                              chordArray.push(chord);
                        }else if (cursor.isRest()){
                              var rest = cursor.rest();                    
                              chordArray.push(rest.tickLen);
                        }
                        cursor.next();
                        }
                  }
            }
            
      var score   = new Score();
      score.name  = "RetroScore";
      score.title = "RetroScore";
      score.appendPart("Flute");    // create two staff piano part
      score.appendMeasures(50);      // append five empty messages
      var newCursor = new Cursor(score);
      newCursor.staff = 0;
      newCursor.voice = 0;
      newCursor.rewind();
      chordArray.reverse();
      
      for(var i = 0; i<chordArray.length; i++){
            var chord = chordArray[i];
            if(typeof chord == 'object'){
                var newChord = addChord(newCursor, chord.tickLen);
                var n     = chord.notes;
                for (var j = 0; j < n; j++) {
                      var note = chord.note(j);
                      addNote(newChord, note.pitch);
                }
            }else{
                //add rest
                var tickLen = chord;
                addRest(newCursor, tickLen);
            }
      }
      
      };

var mscorePlugin = {
      menu: 'Plugins.Retrogade selection',
      init: init,
      run:  run
      };

mscorePlugin;

