import Moment from 'react-moment'
import moment from 'moment'

export function formatMoney(amount) {
  return '$' + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function formatDate(value) {
  const dateToFormat = new Date(value)
  var CurrentDate = moment()
  var daysDifference = CurrentDate.diff(dateToFormat, 'days')

  if (daysDifference > 7) {
    return value
  } else {
    return daysDifference + ' days ago'
  }
}
