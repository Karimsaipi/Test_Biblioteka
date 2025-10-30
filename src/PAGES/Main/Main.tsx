import React from 'react'
import { IPublicationsFilterRequest, PublicationsSortBy, PublicationsSortOrder } from '../../models/IPublication'
import PublicationsSection from '../../COMPONENTS/PublicationSection/PublicationSection'
import styles from './Main.module.scss'

export default function Main() {
  const popular: IPublicationsFilterRequest = {
    page: 1,
    pageSize: 10,
    sortBy: PublicationsSortBy.CREATION_DATE,
    sortOrder: PublicationsSortOrder.DESC,
  }

  const viewed: IPublicationsFilterRequest = {
    page: 1,
    pageSize: 10,
    sortBy: PublicationsSortBy.CREATION_DATE,
    sortOrder: PublicationsSortOrder.DESC,
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <PublicationsSection title="Популярное" requestParams={popular} />
        <PublicationsSection title="Просмотренное" requestParams={viewed} />
      </div>
    </div>
  )
}
