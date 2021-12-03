const Wrapper = styled.div`
  display: none;
  box-shadow: 3px 5px 2px 1px #555555;
  position: fixed;
  width: 400px;
  max-width: 94%; /* For mobile devices */
  margin-left: max(-47%, -200px);
  height: 86px;
  margin-top: -43px;
  left: 50%;
  top: 50%;
  z-index: 999;
`;

const Msg = ({ children }) => <p>{children}</p>;

const MessageHead = styled(Msg)`
  text-align: center;
  font-weight: bold;
`;

const MessageBody = styled(Msg)`
  text-align: center;
`;

const Button = ({className, isShowButton: isShow}) => {
  (isShow) ?
    <Button className={className}></Button>
    : null;
};

const MessageBar = ({ isShow, isShowButton, msgHead, msgBody }) =>{
  (isShow) ?
    <Wrapper>
      <Button className='delete' isShowButton={isShowButton}/>
      <MessageHead>{msgHead}</MessageHead>
      <MessageBody>{msgBody}</MessageBody>
    </Wrapper>
  : null;
};

MessageBar.defaultProps = {
  msgHead: '',
  msgBody:'',
};

MessageBar.propTypes = {
  isShow: Proptypes.bool.isRequired,
  isShowButton: Proptypes.bool.isRequired,
  msgHead: Proptypes.string,
  msgBody: Proptypes.string,
};

export default MessageBar;
