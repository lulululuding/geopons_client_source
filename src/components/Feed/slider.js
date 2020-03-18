import React, { useRef, useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import './slider.scss'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import styled from '@emotion/styled'

// const images = [
//   "/images/1.jpg",
//   "/images/2.jpg",
//   "/images/3.jpg"
// ]

const Carousel = styled.div `
  display:flex;
  width: ${props => props.wid};
  overflow: hidden;
  height: 100%;
  transition: transform 1s ease;
  border-radius: 10px;
  transform: ${props => `translateX(calc(-${props.cur} * ${props.itemWid} ))`};

  filter: grayscale(0.4);

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    display: block;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      to bottom,
      rgba(99, 94, 86, 0.5),
      rgba(99, 94, 86, 0) 30%,
      rgba(64, 65, 66, 0) 70%,
      rgba(33, 34, 35, 0.9)
    );
  }
`

const ItemBackground = styled.div `
  width: ${props => props.itemWid};
  height: 100%;
  border-radius: 10px;
  background: url(${props => props.images[props.idx]}) no-repeat;
  background-size: cover;
`

const Item = memo(({ cur, itemWid, images }) => {
	return (
		<Carousel
			cur={cur}
			wid={images.length + '00%'} 
      itemWid={itemWid}
		>
		{
			images.map((_,idx) => 
        <ItemBackground 
          key={idx} 
          idx={idx} 
          itemWid={itemWid}
          images={images} 
        /> 
      )
		}
		</Carousel>
  	)
})

const Content = memo( ({ loc, lnglat }) => (
  <div className='content'>
    <h2 className="title">{ loc }</h2>
    <div className="location">
      <span>{ lnglat.lng }</span>
      <span className="location_icon">
        <LocationOnIcon fontSize="small" />
      </span>
      <span>{ lnglat.lat }</span>
    </div>
  </div>
) )

const ImgIndex = memo( ({ cur, len }) => {
  const arr = useMemo(() => {
    const arr = []
    for (let i=0;i < len;i++){
      arr.push(i)
    }
    return arr
  }, [len]);
  
  return (
    <div className='index-wrapper'>
      <div className='img-index'>
      {
        len > 1 && arr.map(i => (<div key={i} className={classnames('index-item',{ 'active': cur === i })}></div>))
      }
    </div>
    </div>
  )
} )

const MySlider = memo(({ images }) => {
  const [curItem, setCurItem] = useState(0);
  const touchRef = useRef(null);

  const start = ev => {
    ev.persist();
    touchRef.current = ev.changedTouches[0].clientX;
  };

  const end = ev => {
    ev.persist();
    const touches = ev.changedTouches[0].clientX - touchRef.current;
    if (touches > 20) {
      curItem > 0 && setCurItem(curItem - 1);
    } else if (touches < - 20) {
      curItem < (images.length-1) && setCurItem(curItem + 1);
    }
  };

  const itemWid = useMemo(() => 100/images.length + "%" ,[])

  return (
    <div
      className='my-slider'
      onTouchStart={start}
      onTouchEnd={end}
    >
      <Item cur={curItem} itemWid={itemWid} images={images} />
      <Content loc={'Los Angels'} lnglat={{ lat:'North Lat 36', lng:"East Lng 118" }} />
      <ImgIndex cur={curItem} len={images.length} />
    </div>
  );
} )

export default MySlider