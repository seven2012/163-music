$(function () {


    function initWords() {
        $.get('./songs.json').then(function (object) {
            console.log(object)
            let lyric = object.lyric
            console.log(lyric)
            let array = lyric.split('\n')
            let regex = /^\[(.+)\](.*)$/
            array = array.map(function (string) {
                let matches = regex.exec(string)
                if (matches) {
                    console.log(matches[1])
                    console.log(matches[2])
                    return { time: matches[1], words: matches[2] }
                }
            })

            let $lyric = $('.lyric')
            array.map(function (object) {
                if (!object) { return }
                let $p = $('<p/>')
                $p.attr('data-time', object.time).text(object.words)
                $p.appendTo($lyric.children('.lyric-scroll'))
            })
        })
    }
    initWords()


    function initAudio() {
        let audio = document.createElement('audio')
        audio.src = 'http://oplbcrrjd.bkt.clouddn.com/a1c6%252Fde3a%252F6efd%252F1b7e8ba1ffce645218a1748cd8f644ff.mp3'

        audio.oncanplay = function () {
            audio.play()
            $('.disc-container').addClass('playing')
            $('.pointer').removeClass('change')
        }
        audio.addEventListener('ended', function () {
            $('.pointer').addClass('change')
        })
        $('.icon-pause').on('click', function () {
            audio.pause()
            $('.disc-container').removeClass('playing')
        })
        $('.icon-play').on('click', function () {
            audio.play()
            $('.disc-container').addClass('playing')
        })
        //同步歌词
        setInterval(() => {
            let seconds = audio.currentTime
            let minutes = ~~(seconds / 60)
            let left = seconds - minutes * 60
            let time = `${double(minutes)}:${double(left)}`
            let $lines = $('.lyric-scroll> p')
            let $whichLine
            for (let i = 0; i < $lines.length; i++) {
                let currentLineTime = $lines.eq(i).attr('data-time')
                let nextLineTime = $lines.eq(i + 1).attr('data-time')
                if ($lines.eq(i + 1).length !== 0 && currentLineTime < time && nextLineTime > time) {
                    $whichLine = $lines.eq(i)
                    break
                }
            }
            if ($whichLine) {
                $whichLine.addClass('active').prev().removeClass('active')
                let top = $whichLine.offset().top
                let linesTop = $('.lyric-scroll').offset().top
                let delta = top - linesTop - $('.lyric').height() / 3
                $('.lyric-scroll').css('transform', `translateY(-${delta}px)`)
            }
        }, 300)
    }
    function double(number) {
        return number >= 10 ? number + '' : '0' + number
    }

    initAudio()



})