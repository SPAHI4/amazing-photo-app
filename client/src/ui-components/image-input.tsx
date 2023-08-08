import { ButtonBase, ButtonBaseActions } from '@mui/material';
import React, { useRef, useState } from 'react';
import { css } from '@emotion/react';

export function ImageInput({ onChange }: { onChange: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const buttonActionRef: React.RefObject<ButtonBaseActions> = useRef(null);
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    onChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
    console.log(buttonActionRef.current);
    buttonActionRef.current?.focusVisible();
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <ButtonBase
      action={buttonActionRef}
      focusRipple={isDragging}
      component="div"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      {isDragging ? <div>Yep, right here!</div> : <div css={{ fontSize: '2rem' }}>add picture</div>}
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/avif"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file != null) {
            onChange(file);
          }
        }}
      />
    </ButtonBase>
  );
}
