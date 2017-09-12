
;
( function( window, document, undefined ) {
$('.no-zoom').bind('touchend', function(e) {
  e.preventDefault();
  // Add your code here. 
  $(this).click();
  // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
})

  var labels = {
    rating : {
      updaterTitle : "Terraform Rating"
    },
    megacredits : {
      updaterTitle : "MegaCredits"
    },
    steel : {
      updaterTitle : "Steel"
    },
    titanium : {
      updaterTitle : "Titanium"
    },
    plants : {
      updaterTitle : "Plants"
    },
    energy : {
      updaterTitle : "Energy"
    },
    heat : {
      updaterTitle : "Heat"
    }
  }

  var startingStates = {
    blank : {
      rating : {
        level : 0
      },
      megacredits : {
        level : 0,
        resources : 0
      },
      steel : {
        level : 0,
        resources : 0
      },
      titanium : {
        level : 0,
        resources : 0
      },
      plants : {
        level : 0,
        resources : 0
      },
      energy : {
        level : 0,
        resources : 0
      },
      heat : {
        level : 0,
        resources : 0
      }
    },
    beginnerCorporation : {
      rating : {
        level: 20
      },
      megacredits : {
        level : 1,
        resources : 42
      },
      steel : {
        level : 1,
        resources : 0
      },
      titanium : {
        level : 1,
        resources : 0
      },
      plants : {
        level : 1,
        resources : 0
      },
      energy : {
        level : 1,
        resources : 0
      },
      heat : {
        level : 1,
        resources : 0
      }
    }
  };

  function pauseEvent( e ) {
    if( e.stopPropagation ) { e.stopPropagation(); }
    if( e.preventDefault )  { e.preventDefault(); }
    e.cancelBubble = true;
    e.returnValue = false;
  }
  function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;

    if (!dt || dt > 500 || fingers > 1) return; // not double-tap

    e.preventDefault();
    e.target.click();
  }      

  function ViewModel() {
    var _this = this;
    var _$updater = undefined;

    this.state = {
      rating : {
        level     : {
          value   : ko.observable(0),
          low     : 0
        }
      },
      megacredits : {
        level     : {
          value   : ko.observable(0),
          low     : -5
        },
        resources : {
          value   : ko.observable(0),
          low     : 0
        }
      },
      steel : {
        level     : {
          value   : ko.observable(0),
          low     : 0
        },
        resources : {
          value   : ko.observable(0),
          low     : 0
        }
      },
      titanium : {
        level     : {
          value   : ko.observable(0),
          low     : 0
        },
        resources : {
          value   : ko.observable(0),
          low     : 0
        }
      },
      plants : {
        level     : {
          value   : ko.observable(0),
          low     : 0
        },
        resources : {
          value   : ko.observable(0),
          low     : 0
        }
      },
      energy : {
        level     : {
          value   : ko.observable(0),
          low     : 0
        },
        resources : {
          value   : ko.observable(0),
          low     : 0
        }
      },
      heat : {
        level     : {
          value   : ko.observable(0),
          low     : 0
        },
        resources : {
          value   : ko.observable(0),
          low     : 0
        }
      }
    }

    this.stateJSON = ko.computed( function() {
      return {
        "rating" : {
          "level" : _this.state.rating.level.value()
        },
        "megacredits" : {
          "level" : _this.state.megacredits.level.value(),
          "resources" : _this.state.megacredits.resources.value()
        },
        "steel" : {
          "level" : _this.state.steel.level.value(),
          "resources" : _this.state.steel.resources.value()
        },
        "titanium" : {
          "level" : _this.state.titanium.level.value(),
          "resources" : _this.state.titanium.resources.value()
        },
        "plants" : {
          "level" : _this.state.plants.level.value(),
          "resources" : _this.state.plants.resources.value()
        },
        "energy" : {
          "level" : _this.state.energy.level.value(),
          "resources" : _this.state.energy.resources.value()
        },
        "heat" : {
          "level" : _this.state.heat.level.value(),
          "resources" : _this.state.heat.resources.value()
        }
      };
    }).extend({ rateLimit: 500 });

    this.stateJSON.subscribe( function( newValue ) {
      console.log( "ViewModel :: stateJSON.subscribe(). cookie set..." );
      Cookies.set( "_mars_state", JSON.stringify( newValue ) );
    });

    this.updaterSelectedID = ko.observable();
    this.selectedStateObservable = ko.computed( function() {
      var retval = function(){ return '--'; };

      if( !!_this.updaterSelectedID() )
      {
        var parts = _this.updaterSelectedID().split("_");
        var section = parts[0];
        var field = parts[1];

        retval = _this.state[section][field].value;
      }

      console.log( "selectedStateObservable:", retval );
      return( retval );        
    });

    function _initState( state ) 
    {
      console.log( "ViewModel :: initState()" );
      _this.state.rating.level.value( state.rating.level );
      _this.state.megacredits.level.value( state.megacredits.level );
      _this.state.megacredits.resources.value( state.megacredits.resources );
      _this.state.steel.level.value( state.steel.level );
      _this.state.steel.resources.value( state.steel.resources );
      _this.state.titanium.level.value( state.titanium.level );
      _this.state.titanium.resources.value( state.titanium.resources );
      _this.state.plants.level.value( state.plants.level );
      _this.state.plants.resources.value( state.plants.resources );
      _this.state.energy.level.value( state.energy.level );
      _this.state.energy.resources.value( state.energy.resources );
      _this.state.heat.level.value( state.heat.level );
      _this.state.heat.resources.value( state.heat.resources );
    }

    this.initFromCookie = function( fallback ) {
      console.log( "ViewModel :: initFromCookie()" );
      var cookie = Cookies.get('_mars_state');
      _initState( cookie ? JSON.parse( cookie ) : fallback );
    };

    this.initUI = function() {
      console.log( "ViewModel :: initUI()" );

      _$updater = $( "#update-screen" );

      // main menu : hamburger button
      $( "#main-menu-open" ).on( "click", function() {
        $( "#main-menu" ).addClass( "open" );
      });
      // main menu : close button 
      $( "#main-menu-close" ).on( "click", function() {
        $( "#main-menu" ).removeClass( "open" );
      })

      // main menu : actions : convert plants
      $( "#btn-action-convert-plants" ).on( "click", function(e) {
        pauseEvent( e );

        if( _this.state.plants.resources.value() >= 8 )
        {
          console.log( "ViewModel :: ConvertPlantsBtn.click() - okay to converting" );
          $( "#main-menu" ).removeClass( "open" );

          var obj = { val: _this.state.plants.resources.value() };
          TweenLite.to( obj, 4, { val:_this.state.plants.resources.value() - 8, ease:Strong.easeOut, delay:.5, onUpdate: function() {
            _this.state.plants.resources.value( Math.round( obj.val ) );
          }});
        }
        else
          console.log( "ViewModel :: ConvertPlantsBtn.click() - not enough resources" );

        return( false );
      });

      // main menu : actions : convert heat
      $( "#btn-action-convert-heat" ).on( "click", function( e ) {
        pauseEvent( e );

        if( _this.state.heat.resources.value() >= 8 )
        {
          console.log( "ViewModel :: ConvertPlantsBtn.click() - okay to converting" );
          $( "#main-menu" ).removeClass( "open" );

          var obj = { val: _this.state.heat.resources.value() };
          TweenLite.to( obj, 4, { val:_this.state.heat.resources.value() - 8, ease:Strong.easeOut, delay:.5, onUpdate: function() {
            _this.state.heat.resources.value( Math.round( obj.val ) );
          }});
        }
        else
          console.log( "ViewModel :: ConvertPlantsBtn.click() - not enough resources" );

        return( false );
      });

      // main-menu : phases : production
      $( "#btn-phase-production" ).on( "click", function( e ) {
        console.log( "btn-phase-production.click()" );

        $( "body" ).addClass( "locked" );
        $( "#main-menu" ).removeClass( "open" );

        var time = 0;
        var tlm = new TimelineMax();

        var obj = { 
          megacredits: _this.state.megacredits.resources.value(),
          steel:       _this.state.steel.resources.value(),          
          titanium:    _this.state.titanium.resources.value(),          
          plants:      _this.state.plants.resources.value(),          
          energy:      _this.state.energy.resources.value(),
          heat:        _this.state.heat.resources.value()
        };
        console.log( obj );

        if( obj.energy )
        {
          // animate energy to heat conversion
          tlm.insert( TweenLite.to( obj, 1, { energy:0, ease: Power1.easeOut, onUpdate: function() {
            _this.state.energy.resources.value( Math.ceil( obj.energy ) );
          }}), time );
          tlm.insert( TweenLite.to( obj, 1, { heat: obj.heat + obj.energy, ease:Power1.easeOut, onUpdate: function() {
            _this.state.heat.resources.value( Math.floor( obj.heat ) );
          }}), time );
          time += 1;
        }

        // animate megacredits
        tlm.insert( TweenLite.to( obj, 2, { megacredits:_this.state.megacredits.resources.value() + _this.state.rating.level.value() + _this.state.megacredits.level.value(), ease: Power1.easeOut, onUpdate: function() {
          _this.state.megacredits.resources.value( Math.ceil( obj.megacredits ) );
        }}), time );
        time += 2;

        // animate steel
        var d = _this.state.steel.level.value() / 5;
        tlm.insert( TweenLite.to( obj, d, { steel:_this.state.steel.resources.value() + _this.state.steel.level.value(), ease: Power1.easeOut, onUpdate: function() {
          _this.state.steel.resources.value( Math.ceil( obj.steel ) );
        }}), time );
        time += d;

        // animate titanium
        var d = _this.state.titanium.level.value() / 5;
        tlm.insert( TweenLite.to( obj, d, { titanium:_this.state.titanium.resources.value() + _this.state.titanium.level.value(), ease: Power1.easeOut, onUpdate: function() {
          _this.state.titanium.resources.value( Math.ceil( obj.titanium ) );
        }}), time );
        time += d;

        // animate plants
        var d = _this.state.plants.level.value() / 5;
        tlm.insert( TweenLite.to( obj, d, { plants:_this.state.plants.resources.value() + _this.state.plants.level.value(), ease: Power1.easeOut, onUpdate: function() {
          _this.state.plants.resources.value( Math.ceil( obj.plants ) );
        }}), time );
        time += d;

        // animate plants
        var d = _this.state.energy.level.value() / 5;
        tlm.insert( TweenLite.to( obj, d, { energy:_this.state.energy.level.value(), ease: Power1.easeOut, onUpdate: function() {
          _this.state.energy.resources.value( Math.ceil( obj.energy ) );
        }}), time );
        time += d;
        
        // animate heat
        var d = _this.state.heat.level.value() / 5;
        tlm.insert( TweenLite.to( obj, d, { heat: _this.state.energy.resources.value() + _this.state.heat.resources.value() + _this.state.heat.level.value(), ease: Power1.easeOut, onUpdate: function() {
          _this.state.heat.resources.value( Math.ceil( obj.heat ) );
        }}), time );
        time += d;
        
        tlm.insert( function() {
          $( "body" ).removeClass( "locked" );
        }, time );

      });


      // main menu : new game : blank 
      $( "#btn-new-blank" ).on( "click", function( e ) {
        pauseEvent( e );
        $( "#main-menu" ).removeClass( "open" );
        _initState( startingStates.blank );
        return( false );
      });

      // main menu : new game : beginner corporation 
      $( "#btn-new-beginner" ).on( "click", function( e ) {
        pauseEvent( e );
        $( "#main-menu" ).removeClass( "open" );
        _initState( startingStates.beginnerCorporation );
        return( false );
      });

      // terraform rating handler
      $( "#terraform-rating" ).on( "click", function( e ) {
        console.log( "rating.click()" );
        var id = "rating";
        _this.updaterSelectedID( id + "_level" );
        _$updater.find( "h2" ).html( labels[id].updaterTitle );
        _$updater.addClass( "open" ).addClass( id ).addClass( 'resource' );
      });

      // production level value handler
      $( ".production-level-value" ).on( "click", function( e ) {
        console.log( "click()" );
        var $par = $( this ).parent();
        var id = $par.attr( "id" );
        _this.updaterSelectedID( id + "_level" );
        _$updater.find( "h2" ).html( labels[id].updaterTitle );
        _$updater.addClass( "open" ).addClass( id ).addClass( "level" );
      });

      // resource value handler
      $( ".resource-value" ).on( "click", function( e ) {
        console.log( "click()" );
        var $par = $( this ).parent();
        var id = $par.attr( "id" );
        _this.updaterSelectedID( id + "_resources" );
        
        _$updater.find( "h2" ).html( labels[id].updaterTitle );
        _$updater.addClass( "open" ).addClass( id ).addClass( "resource" );
      });

      // updater : okay button
      $( "#btn-update-okay" ).on( "click", function( e ) {
        _$updater.removeClass( 'open' );
        TweenLite.delayedCall( .25, function() { _$updater.removeClass(); } );
      });

      // updater : + buttons
      $( "#btn-plus-tens" ).on( "click", function() {
        console.log( "btn-plus-tens.click()" );
        _this.selectedStateObservable()( _this.selectedStateObservable()() + 10 );
      });

      $( "#btn-plus-ones" ).on( "click", function() {
        console.log( "btn-plus-ones.click()" );
        _this.selectedStateObservable()( _this.selectedStateObservable()() + 1 );
      });

      // updater : - buttons
      $( "#btn-minus-tens" ).on( "click", function() {
        console.log( "btn-minus-tens.click()" );
        var p = _this.updaterSelectedID().split("_");
        var id = p[0];
        var field = p[1];
        if( _this.selectedStateObservable()() >= _this.state[id][field].low + 10 )
          _this.selectedStateObservable()( _this.selectedStateObservable()() - 10 );
      });
      $( "#btn-minus-ones" ).on( "click", function() {
        console.log( "btn-minus-ones.click()" );
        var p = _this.updaterSelectedID().split("_");
        var id = p[0];
        var field = p[1];
        if( _this.selectedStateObservable()() > _this.state[id][field].low )
          _this.selectedStateObservable()( _this.selectedStateObservable()() - 1 );
      });

      $( "button" ).on( "touchstart", preventZoom );

    };
  };

  $( document ).ready( function() {
    console.log( "ready..." );

    var vm = new ViewModel;
    vm.initFromCookie( startingStates.blank );
    ko.applyBindings( vm );
    vm.initUI();

    setTimeout( function() {
      $( "html" ).removeClass( "loading" );
    }, 500 );

  });

})( window, document );