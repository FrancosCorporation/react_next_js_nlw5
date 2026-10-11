import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import styles from './styles.module.scss'
export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    })
    return (
        <header className={styles.headerContainer}>
            <Image src="/logo.svg" alt="Podcast" width={163} height={40} priority />
            <p>O melhor Podcast</p>
            <span>{currentDate}</span>
        </header>
    )
}
