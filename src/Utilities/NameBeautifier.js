// 's02e23'
let sXXeXX = new RegExp('s(\\d+)e(\\d+)', 'gi')

// 'season 2 episode 4'
let seasonXXepisodeXX = new RegExp('season[ \\.]?(\\d+)[ \\.]?episode[ \\.]?(\\d+)', 'gi')

// '2017.03.04'  ||  '2017 03 04'
let datePattern = new RegExp('(\\d+)[\\. ](\\d+)[\\. ](\\d+)', 'gi')

// 'part.23' || 'folge 23'
let partPattern = new RegExp('part[\\. ](\\d+)|folge[\\. ](\\d+)', 'gi')

// '.412.' || ' 412 ' || ' 4x12 '
let xxxPatter = new RegExp('[\\. ]?(\\d)x?(\\d\\d)[\\. ]?', 'gi')

export default function(title) {

  if (title.match(sXXeXX)) {
    let match = sXXeXX.exec(title)
    return {
      season: match[1],
      episode: match[2],
      beautifiedName: ('S' + match[1].padStart(2, '0') + 'E' + match[2].padStart(2, '0')),
      value: parseInt(match[1], 10) * 1000 + parseInt(match[2], 10)
    }
  }

  if (title.match(seasonXXepisodeXX)) {
    let match = seasonXXepisodeXX.exec(title)
    return {
      season: match[1],
      episode: match[2],
      beautifiedName: ('S' + match[1].padStart(2, '0') + 'E' + match[2].padStart(2, '0')),
      value: parseInt(match[1], 10) * 1000 + parseInt(match[2], 10)
    }
  }

  if (title.match(xxxPatter)) {
    let match = xxxPatter.exec(title)
    return {
      season: match[0],
      episode: match[2],
      beautifiedName: 'S' + match[1].padStart(2, '0') + 'E' + match[2].padStart(2, '0'),
      value: parseInt(match[1], 10) * 1000 + parseInt(match[2], 10)
    }
  }

  if (title.match(datePattern)) {
    let match = datePattern.exec(title)
    let beautifiedDate = match[1] + '.' + match[2].padStart(2, '0') + '.' + match[3].padStart(2, '0')
    let value = parseInt(match[1], 10) * 10000 + parseInt(match[2], 10) * 100 + parseInt(match[3], 10)
    // console.log(value,match[1] + match[2] + match[3])
    return {
      beautifiedName: beautifiedDate,
      value: value
    }
  }

  if (title.match(partPattern)) {
    let match = partPattern.exec(title)

    let name = ''
    let num = 0;
    if (match[1]) {
      name = 'Part ' + match[1].padStart(3, '0')
      num = match[1]
    }
    if (match[2]) {
      name = 'Folge ' + match[2].padStart(3, '0')
      num = match[2]
    }
    return {
      beautifiedName: name,
      value: parseInt(num, 10)
    }
  }

  return {
    beautifiedName: title,
    value: title
  }
}
