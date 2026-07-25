'use client';

import { useLayoutEffect, useRef } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Icon from '@components/common/Icon';

import type { Block } from './content';
import styles from './ReportBlock.module.css';

type ReportBlockProps = {
  block: Block;
  dragHandleLabel: string;
  onCommitText: (id: string, content: string) => void;
};

export default function ReportBlock({ block, dragHandleLabel, onCommitText }: ReportBlockProps) {
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const textRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // contentEditable이라 React가 children을 관리하면 편집 내용을 덮어쓰므로 텍스트를 직접 주입한다.
  // useEffect는 paint 이후에 실행돼 첫 프레임이 빈 상태로 보이므로 useLayoutEffect로 동기 주입.
  useLayoutEffect(() => {
    if (textRef.current && textRef.current.textContent !== block.content) {
      textRef.current.textContent = block.content;
    }
  }, [block.content]);

  return (
    <div ref={setNodeRef} className={isDragging ? styles.dragging : styles.block} style={style}>
      <button
        ref={setActivatorNodeRef}
        aria-label={dragHandleLabel}
        className={styles.dragHandle}
        type="button"
        {...attributes}
        {...listeners}
      >
        <Icon name="grip" />
      </button>
      {block.type === 'image-placeholder' ? (
        <div className={styles.imagePlaceholder}>
          {block.content}
        </div>
      ) : (
        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          aria-level={block.type === 'heading' ? 2 : undefined}
          className={block.type === 'heading' ? styles.blockHeading : styles.blockParagraph}
          role={block.type === 'heading' ? 'heading' : undefined}
          onBlur={(event) => onCommitText(block.id, event.currentTarget.textContent ?? '')}
        />
      )}
    </div>
  );
}
