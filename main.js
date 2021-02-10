
const equalizer = new CanvasEqualizer(
    // the FFT size; must be a power of 2 not less than 8 (recommended: 2048)
    filterLength,
 
    // an AudioContext object
    audioContext, 
 
    // additional, optional parameters with respective defaults
    {
        // whether to update the filter as the user drags the UI around;
        // `false` means the filter is updated only when dragging is done
        updateFilterOnDrag: false,
 
        // the prefix for all CSS classes used by the UI
        classNamespace: 'GE',
 
        // the UI language
        language: 'en',
 
        filterOptions: {
            // how many points the curves will actually have in the UI
            visibleBinCount: 512,
            
            // when needed, the height of a point in the curve will be
            // converted from the dB range (+40 dB to -40 dB) to an integer
            // range (zero to this value); must be an odd number
            validYRangeHeight: 255
        }
    }
);
 
// create and attach, e.g., a MediaElementSourceNode:
const audio = new Audio('https://example.com/sound.mp3');
const source = audioContext.createMediaElementSource(audio);
source.connect(equalizer.convolver);
equalizer.convolver.connect(audioContext.destination);
 
// expose the UI:
equalizer.createControl(document.getElementById('myelement'));
 
// change the UI language (`src/locales` contains the translation strings):
equalizer.loadLocale('pt-BR', {/* object containing translation strings */});
equalizer.language = 'pt-BR';
 
// reset the curves:
equalizer.reset();
 
// destroy the UI:
equalizer.destroyControl();
 
// more properties:
equalizer.filterLength;
equalizer.sampleRate;
equalizer.audioContext;
equalizer.visibleFrequencies;