import React, { memo, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import { useTheme } from '@material-ui/core/styles';
import getImg from '../utils/localFileReader' 
import { blue } from '@material-ui/core/colors';
import scanMap from '../utils/scanMap'

const styles = {
    uploaderWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    uploader: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'40vw',
        maxWidth: '300px',
        height: '200px',
        borderRadius: '6px',
        marginTop: '15px',
        border: '.5px solid #595959'
    },
    img: {
        width: '100%',
        height: '100%'
    },
    clearIcon: {
        position: 'absolute',
    }
}

const Uploader = memo(({ idx, changeImages, imagesRef }) => {
    const [ src, setSrc ] = useState(() => {
        const imagesMap = imagesRef.current
        if(imagesMap.has(idx) && !!imagesMap.get(idx)) return imagesMap.get(idx)
        return null
    })

    const read = useCallback(e => {
        getImg( e.target.files[0], ( url, err, file ) => {
            if (!!err) {
                console.error(err)
            } else {
                changeImages( idx, url );
                setSrc(url)
                imagesRef.current.set("file" + idx, file)
            } 
        })
    }, [ idx, setSrc, imagesRef])

    const clear = useCallback(() => {
        changeImages( idx, null );
        setSrc(null)
        imagesRef.current.delete("file" + idx)
    }, [ idx, setSrc, imagesRef ])

    return (
        <div style={styles.uploader}>
            {
                !src ?  
                <div>
                    <input
                        accept="image/*"
                        id={'image' + idx}
                        style={{ display: 'none' }}
                        type="file"
                        onChange={read}
                    />
                    <label htmlFor={'image' + idx}>
                        <AddCircleOutlineIcon
                            style={{ fontSize: 50 , color: blue[400] }}
                        />
                    </label>
                </div>
                :
                <>
                    <img src={src} style={styles.img} alt={idx}></img>
                    <div 
                        style={styles.clearIcon}
                        onClick={clear}
                    >
                        <CancelIcon style={{ color: '#69696959', fontSize: 50 }} />
                    </div>
                </>
            }
        </div>
    )
})

const UploaderIdx = [0,1,2,3]

function ImgDialogue ({ isOpen, imagesRef, imagesCount, setImagesCnt, toggle }) {
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const changeImages = useCallback((idx, img) => {
    const imagesMap = imagesRef.current;
    if (!!img) {
        imagesMap.set(idx, img)
    } else {
        imagesMap.delete(idx)
    }
    setImagesCnt( scanMap( imagesMap, UploaderIdx ) )
  }, [imagesRef, setImagesCnt])

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={toggle}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
            {
                imagesCount === 0 ? 
                "You can upload images here" 
                : 
                "You have uploaded " + imagesCount + " images"
            }
        </DialogTitle>
        <DialogContent style={styles.uploaderWrapper}>
            {
                UploaderIdx.map(idx => 
                    <Uploader 
                        key={idx} 
                        idx={idx} 
                        changeImages={changeImages}
                        imagesRef={imagesRef}
                    />
                )
            }
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => toggle()} 
            color="primary"
        >
            I Got Finished
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default memo(ImgDialogue)