import React, { memo } from 'react'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const styles = {
    navigation: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '70px 10px 0px',
        fontSize: '12px',
        fontWeight: '600',
        alignItems: 'baseline'
    },
    navigationTitle: {
        fontSize: '12px',
        margin: 0
    },
    navigationCaret: {
        marginRight: '4px'
    },
    icon: {
        margin: '-7px 0'
    }
}

const Navigation = memo(() => {
    return (
        <nav style={styles.navigation}>
            <h2 style={styles.navigationTitle}>
                Stories
            </h2>
            
            <div><ArrowRightIcon style={styles.icon} />Watch all</div>
        </nav>
    ) 
})

export default Navigation