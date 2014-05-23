'use strict';

$(document).ready(function() {
    console.log('page ready');
    var solr = 'FACP';
    var what;
    var currentSet;

    $('#pagination-previous').attr('disabled', 'disabled');
    $('#pagination-next').attr('disabled', 'disabled');

    $('#search-button').click(function() {
        search(0);
     });

    $('#pagination-previous').click(function() {
        var s = currentSet.response.start;
        s = parseInt(s) - 10;
        search(s);
    });
    $('#pagination-next').click(function() {
        var s = currentSet.response.start;
        s = parseInt(s) + 10;
        search(s);
    });

    var search = function(start) {
        what = $('#search-field').val();
        console.log('Perform search for:', what);

        $.ajax({
            url: 'http://data.esrc.info/solr/' + solr + '/select?',
            jsonp: 'json.wrf',
            dataType: 'jsonp',
            data: {
                q: 'name:("' + what + '"^20 OR altname:"' + what + '"^10 OR locality:"' + what + '"^10 OR text:"' + what + '")',
                wt: 'json',
                start: start
              },
            success: function(d) {
                currentSet = d;
                buildResults(d.response.docs);
              }
        });
    }

    var tag = function(record) {
        if (record.main_type === 'Digital Object') {
            return '<span class="glyphicon glyphicon-picture"></span> Digital Object</span><br/>';
        } else if (record.main_type === 'Publication') {
            return '<span class="glyphicon glyphicon-book"></span> Publication</span><br/>';
        } else if (record.main_type === 'Archival Resource') {
            return '<span class="glyphicon glyphicon-file"></span> Archival Resource</span><br/>';
        } else {
            return '<span class="glyphicon glyphicon-certificate"></span> ' + record.type + '</span><br/>';
        }
    }
    var title = function(record) {
        var t, dt, df, d, a;
        if (record.binomial_name !== undefined) { 
            t = '<span class="title-styling lead"><a href="' + record.id + '">' + record.name[0] + ', ' + record.binomial_name + '</a></span>';
        } else {
            t = '<span class="title-styling lead"><a href="' + record.id + '">' + record.name[0] + '</a></span>';
        }
        if (record.date_from === undefined) { df = ''; } else { df = record.date_from.split('-')[0]; }
        if (record.date_to === undefined) { dt = ''; } else { dt = record.date_to.split('-')[0]; }
        if (df !== '' || dt !== '') { 
            d = ' <span class="title-date-styling">' + df + ' - ' + dt + '</span><br/>'
        } else {
            d = '<br/>';
        }
        if (record.altname !== undefined) {
            a = '<strong>Also known as: </strong>' + record.altname.join('; ') + '<br/>';
        } else {
            a = '';
        }
        return t + d + a;
    }
    var text = function(record) {
        var t;
        if (record.abstract !== undefined) {
            t = '<br/>' + record.abstract.match(/.{1,400}/g)[0] + '...';
        } else if (record.text !== undefined) {
            t = '<br/>' + record.text.join(' ').match(/.{1,400}/g)[0] + '...';
        } else {
            t = '';
        }

        return t;
    }
    var id = function(record) {
        return '<br/><em><a href="' + record.id + '">' + record.id + '</a></em><br/><br/>';
    }
    var buildResults = function(docs) {
        // remove any existing result set
        $('#results-list').empty();

        console.log(docs);
        var i;
        for (i=0; i < docs.length; i++) {
            // assemble the search result;
            var d = docs[i];
            var wrapper = $('<span class="" />');
            var results = wrapper.append(tag(d)).append(title(d)).append(text(d)).append(id(d));
            $('#results-list').append(results);
        }

        if (parseInt(currentSet.response.start) == 0) {
            $('#pagination-previous').attr('disabled', 'disabled'); 
        }  else {
            $('#pagination-previous').removeAttr('disabled');
        }
        if (parseInt(currentSet.response.start) + 10  >= parseInt(currentSet.response.numFound)) {
            $('#pagination-next').attr('disabled', 'disabled');
        } else {
            $('#pagination-next').removeAttr('disabled');
        }

        $('#total').text(currentSet.response.numFound);
        $('#start').text(parseInt(currentSet.response.start) + 1);
        $('#end').text(parseInt(currentSet.response.start) + 10);
    }
  });