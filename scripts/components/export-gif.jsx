import clsx from 'clsx';
import ControlComponent from './control.jsx';
import ProgressBarComponent from './progress-bar.jsx';

class ExportGifComponent {
  view({
    attrs: { isExportingGif, exportProgress, isGifExportFinished, exportedImageUrl, abort }
  }) {
    return (
      <div
        className={clsx('export-gif-screen', {
          visible: isExportingGif || isGifExportFinished
        })}
      >
        <ControlComponent
          id="close-export-gif-overlay"
          title={isGifExportFinished ? 'Close overlay' : 'Abort GIF export'}
          icon="close"
          action={() => abort()}
        />
        <div className="export-gif-overlay" />
        <div className="export-gif-heading">
          {exportedImageUrl ? 'GIF Generated!' : 'Generating GIF...'}
        </div>
        <p className="export-gif-message">
          {exportedImageUrl
            ? 'Right-click the image and choose "Save Image As..." to download.'
            : ''}
        </p>
        {exportedImageUrl ? (
          <img className="exported-image" src={exportedImageUrl} alt="Exported GIF" />
        ) : (
          <ProgressBarComponent progress={exportProgress} />
        )}
      </div>
    );
  }
}

export default ExportGifComponent;
